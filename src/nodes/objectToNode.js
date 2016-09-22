function ObjectToNode(element, attribute, text) {
    this.element = element;
    this.attribute = attribute;
    this.text = text;
};

ObjectToNode.prototype.getNode = function () {
    node = document.createElement(this.element);

    if(this.attribute != null) {
        attribute = this.attribute;
        Object.keys(attribute).forEach(function (attr) {
            attr_node = document.createAttribute(attr);
            attr_node.value = attribute[attr];
            node.setAttributeNode(attr_node);
        });
    }

    if(this.text != null) {
        text = document.createTextNode(this.text);
        node.appendChild(text);
    }

    return node;
}

module.exports = ObjectToNode;