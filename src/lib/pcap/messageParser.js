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
};

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

function parse(result_buf, callback) {
    Object.keys(filter).forEach(function (key) {
        if (result_buf.indexOf(filter[key].index) > -1) {

            var id_message = filter[key].parse(result_buf, separator);

            // console.log(id_message);
            callback(id_message);
        }
    })
}

module.exports = {
    parse: parse
}