var ObjectToNode = require('./objectToNode.js');

var ChatNode = {
    notice: notice,
    chat: chat,
    info: info
}

function notice(name, message) {
    var divElement = new ObjectToNode('div');

    divElement.text = message;
    chatNode = divElement.getNode();

    return chatNode;
};

function chat(name, message) {
    var divElement = new ObjectToNode('div');

    divElement.text = ': ' + message;
    chatNode = divElement.getNode();

    var aElement = new ObjectToNode('a', null, name);

    chatNode.insertBefore(aElement.getNode(), chatNode.firstChild);

    return chatNode;
};

function info(name, message) {
    var divElement = new ObjectToNode('div');

    divElement.text = message;
    chatNode = divElement.getNode();

    var aElement = new ObjectToNode('a', null, name);

    chatNode.insertBefore(aElement.getNode(), chatNode.firstChild);

    return chatNode;
};

module.exports = ChatNode;