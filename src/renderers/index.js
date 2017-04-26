const remote = require('electron').remote;
const paths  = remote.getGlobal('paths');

global.src = {};
for (var path in paths) {
    global.src[path] = paths[path];
}

global.logger = require(global.src.libPath + '/logger.js');
const dialog = require('electron').remote.dialog;
const guildMsgPane = document.getElementById('guildMessage');
const MessageCapture = require(global.src.libPath + '/pcap/messageCapture.js');
var ChatNode = require(global.src.modulesPath + '/nodes/chatNode.js');

var captureList = ['아본', '아수'];

function addChat() {
    guildMsgPane.appendChild(ChatNode.chat('gbsong', 'test'));

    guildMsgPane.scrollTop = guildMsgPane.scrollHeight;
}

var messageCapture = new MessageCapture('10.0.40.40');
var messageParser = require(global.src.libPath + '/pcap/messageParser.js');

messageCapture.on('message', function (resultBuf) {
    messageParser.parse(resultBuf, function (obj) {
        var chatPane = document.getElementById(obj.type);
        if (chatPane !== null) {
            captureList.forEach(function (capture) {
                var match = new RegExp(capture);

                if (obj.message.match(match)) {
                    const options = {
                        type: 'info',
                        title: obj.name,
                        message: obj.message,
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
    })
})

const horn_search = document.getElementById('horn-search');
const horn_search_keyword = document.getElementById('horn-search-keyword');
horn_search_keyword.value = captureList;

horn_search.addEventListener('click', function () {
    captureList = horn_search_keyword.value.split(',');
})

$("#revealButton2").click(function () {
    var pop = new Foundation.Reveal($('#device-selector'), {
        animationIn: true,
        animationOut: true
    })
    pop.open();
    $('a.close-reveal-modal').on('click', function() {
      pop.close();
    });
})

const BrowserWindow = require('electron').remote.BrowserWindow
const newWindowBtn = document.getElementById('revealButton')

const __path = require('path')

newWindowBtn.addEventListener('click', function (event) {
    const modalPath = __path.join('file://', __dirname, 'src/views/deviceSelect.html')
    let win = new BrowserWindow({ frame: false })
    win.on('close', function () { win = null })
    win.loadURL(modalPath)
    win.show()
})