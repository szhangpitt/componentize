const h = require('snabbdom/h').default;
const nav = require('./nav');
const viewer = require('./viewer');

function vnode ({pages, currentPageNum}, dispatch) {
    return h('div', [
        nav({pages, currentPageNum}, dispatch),
        viewer({pages, currentPageNum}, dispatch),
    ]);
}

module.exports = vnode;
