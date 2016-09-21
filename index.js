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
var userChatIndex = new Buffer('526c0010000000', 'hex');
var guildChatIndex = new Buffer('c36f0000000000000000', 'hex');

var filter = {
  userChatIndex: userChatIndex,
  guildChatIndex: guildChatIndex
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
          if (result_buf.indexOf(filter[key]) > -1) {
            // test output
            // console.log(result_buf);
            // console.log(result_buf.toString('utf8'));
            // console.log(result_buf.indexOf(separator));
            var id_message = bufferSplit(result_buf, separator);

            console.log(id_message);
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
  var stringArray = [];

  var firstSeparator = buffer.indexOf(separator)+4;

  var idBuf = buffer.slice(firstSeparator, buffer.indexOf(separator, firstSeparator));

  var secondSeparator = buffer.indexOf(separator, firstSeparator)+4;

  var msgBuf = buffer.slice(secondSeparator, buffer.indexOf(new Buffer('00', 'hex'), secondSeparator));

  // test output
  // console.log(idBuf);
  // console.log(msgBuf);

  stringArray.push(idBuf.toString('utf8'));
  stringArray.push(msgBuf.toString('utf8'));
  
  return stringArray;
}