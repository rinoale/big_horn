function NetworkNode(network) {
    this.network = network;

}

NetworkNode.prototype.getNetworkInfo = function () {
    this.clickable_a = document.createElement('a');
    this.clickable_a.href = '#';

    this.appendRow('addresses');
    this.appendRow('description');
    this.appendRow('name');

    return this.clickable_a;
}

NetworkNode.prototype.appendRow = function (subject) {
    var row_div = document.createElement('div');
    row_div.class = 'row';

    var key_a = document.createElement('a');
    key_a.text = subject.toUpperCase() + ':' + (this.network[subject] instanceof Array ? addressParse(this.network[subject]) : this.network[subject]);
    var value_a = document.createElement('a');
    value_a.className = subject;
    row_div.appendChild(key_a);
    row_div.appendChild(value_a);
    this.clickable_a.appendChild(row_div);
}

function addressParse(addresses) {
    var addressArray = [];

    addresses.forEach(function (obj) {
        addressArray.push(obj['addr']);
    })

    return addressArray.join(',');
}

module.exports = NetworkNode;