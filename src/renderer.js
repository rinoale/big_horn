const guildMsgPane = document.getElementById('guildMessage');

var ChatNode = require('./nodes/chatNode.js');

guildMsgPane.appendChild(ChatNode.chat('gbsong', 'test'));