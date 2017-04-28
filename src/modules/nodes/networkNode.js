function NetworkNode(network) {
    this.network = network;

}

NetworkNode.prototype.getNetworkInfo = function () {
    this.clickable_a = document.createElement('tr');

    this.appendRow('addresses');
    this.appendRow('description');
    this.appendRow('name');

    return this.clickable_a;
}

NetworkNode.prototype.appendRow = function (subject) {
    var td = document.createElement('td');
    td.innerHTML = (this.network[subject] instanceof Array ? addressParse(this.network[subject]) : this.network[subject]);
    this.clickable_a.appendChild(td);
}

function addressParse(addresses) {
    var addressArray = [];

    addresses.forEach(function (obj) {
        addressArray.push(obj['addr']);
    })

    return addressArray.join(',');
}

module.exports = NetworkNode;