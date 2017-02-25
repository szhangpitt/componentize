const viewer = require('./components/viewer');
const nav = require('./components/nav');

const Rx = require('rxjs/Rx');
const xdispatch = require('./lib/x-dispatch');



((function ComponentFirstApplication () {

    const app$ = new Rx.BehaviorSubject({
        document: {
            pages: [
                'This is some fake content of a pdf document...',
                'And some other fake content...',
                'The last page...',
            ],
        },
        currentPageNum: 0,
    });

    const reduceCurrentPageNum = (currentPageNum, action) => {
        return action.type === 'viewer_change_page'
            || action.type === 'nav_change_page' ?
            action.data
            : currentPageNum;
    };

    const reducePages = (pages, action) => {
        return action.type === 'app_change_pages' ?
            action.data
            : pages;
    };

    const reduce = (state, action) => {
        return {
            document: {
                pages: reducePages(state.document.pages, action),
            },
            currentPageNum: reduceCurrentPageNum(state.currentPageNum, action),
        };
    };

    const dispatch = xdispatch(app$, reduce);

    const viewer$ = app$.map(state => ({
        pages: state.document.pages,
        currentPageNum: state.currentPageNum,
    }));

    const nav$ = app$.map(state => ({
        pages: state.document.pages,
        currentPageNum: state.currentPageNum,
    }));

    const viewer1 = viewer(viewer$, document.querySelector('#viewer1'), dispatch);
    const viewer2 = viewer(viewer$, document.querySelector('#viewer2'), dispatch);
    const nav1 = nav(nav$, document.querySelector('#nav1'), dispatch);
    const nav2 = nav(nav$, document.querySelector('#nav2'), dispatch);

})());
