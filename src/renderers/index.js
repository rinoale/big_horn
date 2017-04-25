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

var include = require(global.src.libPath + '/include');

window.$ = window.jQuery = require(global.src.resourcesPath + '/foundation/js/vendor/jquery.js');


// custom css
include.link(global.src.resourcesPath + '/css/custom.css')
// custom css

// foundation css ans js
require(global.src.resourcesPath + '/foundation/js/vendor/what-input.js');
require(global.src.resourcesPath + '/foundation/js/vendor/foundation.js');
require(global.src.resourcesPath + '/foundation/js/app.js');

include.link(global.src.resourcesPath + '/foundation/css/foundation.css')
include.link(global.src.resourcesPath + '/foundation/css/app.css')
// foundation css ans js

var captureList = ['아본', '아수'];

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
});

const testButton = document.getElementById('testButton');

testButton.addEventListener('click', function () {

});

const horn_search = document.getElementById('horn-search');
const horn_search_keyword = document.getElementById('horn-search-keyword');
horn_search_keyword.value = captureList;

horn_search.addEventListener('click', function () {
    captureList = horn_search_keyword.value.split(',');
})