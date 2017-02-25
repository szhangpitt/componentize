const snabbdom = require('snabbdom');
const patch = require('./patch');
const h = require('snabbdom/h').default;

function vnode ({pages, currentPageNum}, dispatch) {
    return h('article',
        pages.map((pageText, i) =>
            h('section', {
                attrs: { 'data-index': i },
                class: { 'active': i === currentPageNum },
            }, [
                h('p', pageText),
                h('a', {
                    props: { href: '#' },
                    on: { click: [dispatch, { type: 'viewer_change_page', data: i }]},
                }, 'Go to this page'),
            ])
        )
    );
}

function init () {
    return {
        pages: [],
        currentPageNum: -1,
    };
}

module.exports =
function patchVnode (state$, target, dispatch) {
    const vnodeStream = state$
    .map((state) => vnode(state, dispatch))
    .startWith(target)
    .pairwise()
    .subscribe(([oldVnode, newVnode]) => patch(oldVnode, newVnode));
};
