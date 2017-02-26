const viewer = require('./components/viewer');
const nav = require('./components/nav');
const xdispatch = require('./lib/x-dispatch');
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
        currentPageNum: 0,
    }, {
        document: {
            pages: [
                'Another doc!',
                'And some other fake content...',
                'The last page...',
            ],
        },
        currentPageNum: 0,
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

    const nav1$ = doc1State$.map(navStateMap);
    const nav2$ = doc2State$.map(navStateMap);


    const viewer1 = viewer(viewer1$, document.querySelector('#viewer1'), dispatch1);
    const viewer2 = viewer(viewer2$, document.querySelector('#viewer2'), dispatch2);
    const nav1 = nav(nav1$, document.querySelector('#nav1'), dispatch1);
    const nav2 = nav(nav2$, document.querySelector('#nav2'), dispatch2);

    // since nav0 changes all currentPageNum to the same value,
    // just picking the 1st item will do
    const nav0 = nav(nav1$, document.querySelector('#nav0'), dispatch0);

})());
