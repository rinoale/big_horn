function MessageCapture(callback) {
    var Cap = require('cap').Cap,
        decoders = require('cap').decoders,
        PROTOCOL = decoders.PROTOCOL;

    var c = new Cap(),
        device = Cap.findDevice('192.168.0.4'),
        filter = 'tcp and src net 211.218',
        bufSize = 10 * 1024 * 1024,
        buffer = new Buffer(65535);

    var linkType = c.open(device, filter, bufSize, buffer);

    var separator = new Buffer('000600', 'hex');
    var publicChatIndex = new Buffer('526c0010000000', 'hex');
    var guildChatIndex = new Buffer('c36f0000000000000000', 'hex');
    var bigHornIndex = new Buffer('3c414c4c5f4348414e4e454c533e', 'hex');

    var filter = {
    publicChatIndex: {
        index: publicChatIndex,
        parse: publicChatParser
    },
    guildChatIndex: {
        index: guildChatIndex,
        parse: guildChatParser
    },
    bigHornIndex: {
        index: bigHornIndex,
        parse: bigHornParser
    }
    }

    function publicChatParser(buffer) {
        var obj = bufferSplit(buffer, separator);
        obj.type = 'public';
        return obj;
    }

    function guildChatParser(buffer) {
        var obj = bufferSplit(buffer, separator);
        obj.type = 'guild';
        return obj;
    }

    function bigHornParser(buffer) {
        var solIndex = buffer.indexOf(bigHornIndex)+18;
        var bigHornEOL = new Buffer('00010103ffffffff03000000000107', 'hex');
        var eolIndex = buffer.indexOf(bigHornEOL);

        var slice_ALL_CHANNEL = buffer.slice(solIndex, eolIndex);

        var bighornSeparator = new Buffer('203a20', 'hex');
        var bighornSeparatorIndex = slice_ALL_CHANNEL.indexOf(bighornSeparator);

        var idBuf = slice_ALL_CHANNEL.slice(0, bighornSeparatorIndex);
        var msgBuf = slice_ALL_CHANNEL.slice(bighornSeparatorIndex+3, slice_ALL_CHANNEL.length);

        return {
            name: idBuf.toString('utf8'),
            message: msgBuf.toString('utf8'),
            type: 'horn'
        };
    }

    c.setMinBytes && c.setMinBytes(0);

    c.on('packet', function(nbytes, trunc) {
    // console.log('packet: length ' + nbytes + ' bytes, truncated? '
    //             + (trunc ? 'yes' : 'no'));

    // raw packet data === buffer.slice(0, nbytes)

    if (linkType === 'ETHERNET') {
        var ret = decoders.Ethernet(buffer);

        if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
        // console.log('Decoding IPv4 ...');

        ret = decoders.IPV4(buffer, ret.offset);
        // console.log('from: ' + ret.info.srcaddr + ' to ' + ret.info.dstaddr);

        if (ret.info.protocol === PROTOCOL.IP.TCP) {
            var datalen = ret.info.totallen - ret.hdrlen;

            // console.log('Decoding TCP ...');

            ret = decoders.TCP(buffer, ret.offset);
            // console.log(' from port: ' + ret.info.srcport + ' to port: ' + ret.info.dstport);
            datalen -= ret.hdrlen;

            var result_buf = buffer.slice(ret.offset, ret.offset + datalen);

            Object.keys(filter).forEach(function (key) {
            if (result_buf.indexOf(filter[key].index) > -1) {

                var id_message = filter[key].parse(result_buf, separator);

                // console.log(id_message);
                callback(id_message);
            }
            })
        } else if (ret.info.protocol === PROTOCOL.IP.UDP) {
            console.log('Decoding UDP ...');

            ret = decoders.UDP(buffer, ret.offset);
            console.log(' from port: ' + ret.info.srcport + ' to port: ' + ret.info.dstport);
            console.log(buffer.toString('binary', ret.offset, ret.offset + ret.info.length));
        } else
            console.log('Unsupported IPv4 protocol: ' + PROTOCOL.IP[ret.info.protocol]);
        } else
        console.log('Unsupported Ethertype: ' + PROTOCOL.ETHERNET[ret.info.type]);
    }
    });

    function bufferSplit(buffer, separator) {
    var firstSeparator = buffer.indexOf(separator)+4;

    var idBuf = buffer.slice(firstSeparator, buffer.indexOf(separator, firstSeparator));

    var secondSeparator = buffer.indexOf(separator, firstSeparator)+4;

    var msgBuf = buffer.slice(secondSeparator, buffer.indexOf(new Buffer('00', 'hex'), secondSeparator));
    
    return {
        name: idBuf.toString('utf8'),
        message: msgBuf.toString('utf8')
    };
    }
}

module.exports = MessageCapture;