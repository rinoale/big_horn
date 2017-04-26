var EventEmitter = require('events').EventEmitter;
var util = require('util');

function MessageCapture() {
    this.Cap = require('cap').Cap;
    this.decoders = require('cap').decoders;
    this.PROTOCOL = this.decoders.PROTOCOL;
}

util.inherits(MessageCapture, EventEmitter);

MessageCapture.prototype.networklist = function () {
    return this.Cap.deviceList();
}

MessageCapture.prototype.start = function (address) {
    var c = new this.Cap(),
        device = this.Cap.findDevice(address),
        filter = 'tcp and src net 211.218',
        bufSize = 10 * 1024 * 1024,
        buffer = new Buffer(65535);

    var linkType = c.open(device, filter, bufSize, buffer);

    c.setMinBytes && c.setMinBytes(0);

    c.on('packet', (nbytes, trunc) => {
        // console.log('packet: length ' + nbytes + ' bytes, truncated? '
        //             + (trunc ? 'yes' : 'no'));

        // raw packet data === buffer.slice(0, nbytes)

        if (linkType === 'ETHERNET') {
            var ret = this.decoders.Ethernet(buffer);

            if (ret.info.type === this.PROTOCOL.ETHERNET.IPV4) {
            // console.log('Decoding IPv4 ...');

            ret = this.decoders.IPV4(buffer, ret.offset);
            // console.log('from: ' + ret.info.srcaddr + ' to ' + ret.info.dstaddr);

            if (ret.info.protocol === this.PROTOCOL.IP.TCP) {
                var datalen = ret.info.totallen - ret.hdrlen;

                // console.log('Decoding TCP ...');

                ret = this.decoders.TCP(buffer, ret.offset);
                // console.log(' from port: ' + ret.info.srcport + ' to port: ' + ret.info.dstport);
                datalen -= ret.hdrlen;

                var result_buf = buffer.slice(ret.offset, ret.offset + datalen);

                global.logger.info('result_buf', result_buf);

                this.emit('message', result_buf);
            } else if (ret.info.protocol === this.PROTOCOL.IP.UDP) {
                console.log('Decoding UDP ...');

                ret = this.decoders.UDP(buffer, ret.offset);
                console.log(' from port: ' + ret.info.srcport + ' to port: ' + ret.info.dstport);
                console.log(buffer.toString('binary', ret.offset, ret.offset + ret.info.length));
            } else
                console.log('Unsupported IPv4 protocol: ' + this.PROTOCOL.IP[ret.info.protocol]);
            } else
            console.log('Unsupported Ethertype: ' + this.PROTOCOL.ETHERNET[ret.info.type]);
        }
    });
}


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

module.exports = MessageCapture;