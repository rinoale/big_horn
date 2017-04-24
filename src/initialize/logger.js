var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            filename: 'log/big_horn.log',
            level: 'info'
        })
    ]
})

// var transportFile = {
//     filename: 'log/big_horn.log',
//     level: 'info'
// }

// logger.add(winston.transports.File, transportFile);

module.exports = logger;