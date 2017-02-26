const h = require('snabbdom/h').default;

function vnode ({pages, currentPageNum}, dispatch) {
    return h('nav', [
        h('div', []
            .concat(pages.map((pageText, i) =>
                h('button', {
                    on: { click: [dispatch, { type: 'nav_change_page', data: i }] },
                }, i)
            ))
            .concat(h('div', [
                h('p', `Current Page is ${currentPageNum}`),
            ]))
        )]
    );
}

module.exports = vnode;
