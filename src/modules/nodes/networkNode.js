var EventEmitter = require('events').EventEmitter;
var util = require('util');

function NetworkNode(network) {
    this.network = network;

}

util.inherits(NetworkNode, EventEmitter);

NetworkNode.prototype.getNetworkInfo = function (index) {
    this.hasIp;

    this.network['addresses'].forEach((address) => {
        if (address['addr'].match(/[a-zA-Z]/) === null) {
            this.hasIp = address['addr'];
        }
    });

    if (this.hasIp === undefined) {
        return;
    } 

    this.clickable_li = document.createElement('li');
    this.clickable_li.setAttribute('id', index);
    this.clickable_li.setAttribute('class', 'accordion-item');
    this.clickable_li.setAttribute('data-accordion-item', '');

    this.appendRow('description');
    this.appendRow('addresses');

    // this.appendRow('name');

    return this.clickable_li;
}

NetworkNode.prototype.appendRow = function (subject) {
    switch(subject) {
        case 'description':
            var accordion_title = document.createElement('a');
            accordion_title.href = '#';
            accordion_title.setAttribute('class', 'accordion-title');
            accordion_title.text = this.network[subject];

            this.clickable_li.appendChild(accordion_title);
            break;
        case 'addresses':
            var accordion_content = document.createElement('div');
            accordion_content.setAttribute('class', 'accordion-content');
            accordion_content.setAttribute('data-tab-content', '');
            var content_p = document.createElement('p');
            content_p.innerHTML = this.hasIp;

            var button_a = document.createElement('a');
            button_a.href = '#';
            button_a.setAttribute('class', 'small button');
            button_a.text = '선택';

            button_a.addEventListener("click", () => {
                this.emit('select', this.hasIp);
            })

            accordion_content.appendChild(content_p);
            accordion_content.appendChild(button_a);
            this.clickable_li.appendChild(accordion_content);
            break;
    }
}

function addressParse(addresses) {
    var addressArray = [];

    addresses.forEach(function (obj) {
        addressArray.push(obj['addr']);
    })

    return addressArray.join(',');
}

module.exports = NetworkNode;