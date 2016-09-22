const guildMsgPane = document.getElementById('guildMessage');
const MessageCapture = require('./pcap/messageCapture.js');

var ChatNode = require('./nodes/chatNode.js');

function addChat() {
    guildMsgPane.appendChild(ChatNode.chat('gbsong', 'test'));

    guildMsgPane.scrollTop = guildMsgPane.scrollHeight;
}

MessageCapture(function (obj) {
    console.log(obj.type);
    var chatPane = document.getElementById(obj.type);
    if (chatPane !== null) {
        chatPane.appendChild(ChatNode.chat(obj.name, obj.message))
    } else {
        console.log('Chat pane is not defined', obj);
    }
});

const testButton = document.getElementById('testButton');

testButton.addEventListener('click', function () {
    addChat();
});