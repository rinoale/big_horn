function includeLink (stylesheet) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheet;
    document.head.appendChild(link);
}

function includeScript (javascript) {
    var script = document.createElement('script');
    script.src = javascript;
    document.head.appendChild(script);
}

module.exports = {
    link: includeLink,
    script: includeScript
};
