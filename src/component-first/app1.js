const viewer = require('./components/viewer');
const nav = require('./components/nav');
const xdispatch = require('./lib/x-dispatch');
const run = require('./lib/run-component');
const assign = Object.assign;

((function ComponentFirstApplication () {

    const appState = [{
        document: {
            pages: [
                'This is some fake content of a pdf document...',
                'And some other fake content...',
                'The last page...',
            ],
        },
        currentPageNum: 1,
    }, {
        document: {
            pages: [
                'Another doc!',
                'And some other fake content...',
                'The last page...',
            ],
        },
        currentPageNum: 2,
    }];

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

    const reduceSingleDoc = (state, action) => {
        return {
            document: {
                pages: reducePages(state.document.pages, action),
            },
            currentPageNum: reduceCurrentPageNum(state.currentPageNum, action),
        };
    };

    const reduceAllDocsCurrentPageNum = (allDocStates, action) => {
        return allDocStates.map(singleDocState => {
            return action.type === 'nav_change_page'
                ? assign({}, singleDocState, { currentPageNum: action.data })
                : singleDocState;
        });
    };

    const viewerStateMap = (singleDocState) => {
        return {
            pages: singleDocState.document.pages,
            currentPageNum: singleDocState.currentPageNum,
        };
    };

    const navStateMap = (singleDocState) => {
        return {
            pages: singleDocState.document.pages,
            currentPageNum: singleDocState.currentPageNum,
        };
    };

    const pickFirst = (allDocStates) => allDocStates[0];
    const pickSecond = (allDocStates) => allDocStates[1];

    const dispatch1 = xdispatch(appState[0], reduceSingleDoc);
    const dispatch2 = xdispatch(appState[1], reduceSingleDoc);
    const dispatch0 = xdispatch(appState, reduceAllDocsCurrentPageNum);

    const doc1State$ = dispatch1.targetState$;
    const doc2State$ = dispatch2.targetState$;
    const allDocs$ = dispatch0.targetState$;

    const viewer1$ = doc1State$.merge(allDocs$.map(pickFirst)).map(viewerStateMap);
    const viewer2$ = doc2State$.merge(allDocs$.map(pickSecond)).map(viewerStateMap);

    const nav1$ = doc1State$.merge(allDocs$.map(pickFirst)).map(navStateMap);
    const nav2$ = doc2State$.merge(allDocs$.map(pickSecond)).map(navStateMap);

    // let nav0 state stream follow the latest of nav1 and nav2,
    const nav0$ = nav1$.combineLatest(nav2$, function (nav1State, nav2State) {
        return {
            // display a "summary" of current page num
            currentPageNum: `[nav1: ${nav1State.currentPageNum}, nav2: ${nav2State.currentPageNum}]`,
            pages: nav1State.pages,
        };
    });

    const viewer1 = run(viewer, document.querySelector('#viewer1'))(viewer1$, dispatch1);
    const viewer2 = run(viewer, document.querySelector('#viewer2'))(viewer2$, dispatch2);
    const nav1 = run(nav, document.querySelector('#nav1'))(nav1$, dispatch1);
    const nav2 = run(nav, document.querySelector('#nav2'))(nav2$, dispatch2);

    const nav0 = run(nav, document.querySelector('#nav0'))(nav0$, dispatch0);

})());
