const guildMsgPane = document.getElementById('guildMessage');

var ChatNode = require('./nodes/chatNode.js');

function addChat() {
    guildMsgPane.appendChild(ChatNode.chat('gbsong', 'test'));

    guildMsgPane.scrollTop = guildMsgPane.scrollHeight;
}

const testButton = document.getElementById('testButton');

testButton.addEventListener('click', function () {
    addChat();
});