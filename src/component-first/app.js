const viewer = require('./viewer');
const Rx = require('rxjs/Rx');

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

    const viewer$ = app$.map(mapViewerState);

    const viewer1 = viewer(viewer$, document.querySelector('#viewer1'), dispatch);
    // var nav = new Navigator(app$, $('#nav1'));
    // var nav = new Navigator(app$, $('#nav2'));

    function mapViewerState (state) {
        return {
            pages: state.document.pages,
            currentPageNum: state.currentPageNum,
        };
    }

    function dispatch (action) {
        const oldState = app$.getValue();
        const newState = reduce(oldState, action);
        app$.next(newState);
    }

    function reduce (state, action) {
        return {
            document: {
                pages: reducePages(state.document.pages, action),
            },
            currentPageNum: reduceCurrentPageNum(state.currentPageNum, action),
        };
    }

    function reduceCurrentPageNum (currentPageNum, action) {
        return action.type === 'viewer_change_page' ?
            action.data
            : currentPageNum;
    }

    function reducePages (pages, action) {
        return action.type === 'app_change_pages' ?
            action.data
            : pages;
    }

})());
