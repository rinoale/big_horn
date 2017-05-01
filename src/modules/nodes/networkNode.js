function NetworkNode(network) {
    this.network = network;

}

NetworkNode.prototype.getNetworkInfo = function (index) {
    this.clickable_li = document.createElement('li');
    this.clickable_li.setAttribute('id', index);
    this.clickable_li.setAttribute('class', 'accordion-item');
    this.clickable_li.setAttribute('data-accordion-item', '');

    this.appendRow('description');
    this.appendRow('addresses');

    // this.appendRow('name');

    console.log(this.clickable_li);

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
            content_p.innerHTML = addressParse(this.network[subject]);

            accordion_content.appendChild(content_p);
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