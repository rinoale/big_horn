const guildMsgPane = document.getElementById('guildMessage');
const MessageCapture = require('./pcap/messageCapture.js');
const dialog = require('electron').remote.dialog;

var ChatNode = require('./nodes/chatNode.js');

var captureList = ['스카하'];

function addChat() {
    guildMsgPane.appendChild(ChatNode.chat('gbsong', 'test'));

    guildMsgPane.scrollTop = guildMsgPane.scrollHeight;
}

MessageCapture(function (obj) {
    var chatPane = document.getElementById(obj.type);
    if (chatPane !== null) {
        captureList.forEach(function (capture) {
            var match = new RegExp(capture);

            if (obj.message.match(match)) {
                const options = {
                    type: 'info',
                    title: 'information',
                    message: 'message captured',
                    buttons: ['Close']
                }
                dialog.showMessageBox(options, function (index) {
                    console.log(index);
                });
            }
        })
        chatPane.appendChild(ChatNode.chat(obj.name, obj.message));
        chatPane.scrollTop = chatPane.scrollHeight;
    } else {
        console.log('Chat pane is not defined', obj);
    }
});

const testButton = document.getElementById('testButton');

testButton.addEventListener('click', function () {

});