const viewer = require('./components/viewer');
const nav = require('./components/nav');
const xdispatch = require('./lib/x-dispatch');
const run = require('./lib/run-component');
const assign = Object.assign;
const Observable = require('rxjs/Rx').Observable;

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

    const pickDoc1 = (allDocStates) => allDocStates[0];
    const pickDoc2 = (allDocStates) => allDocStates[1];

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

    const updateDoc1 = xdispatch(pickDoc1(appState), reduceSingleDoc);
    const updateDoc2 = xdispatch(pickDoc2(appState), reduceSingleDoc);
    const updateBothDocs = xdispatch(appState, reduceAllDocsCurrentPageNum);

    const viewer1$ = Observable.merge(
        updateDoc1.$,
        updateBothDocs.$.map(pickDoc1)
    ).map(viewerStateMap);

    const viewer2$ = Observable.merge(
        updateDoc2.$,
        updateBothDocs.$.map(pickDoc2)
    ).map(viewerStateMap);

    const nav1$ = Observable.merge(
        updateDoc1.$,
        updateBothDocs.$.map(pickDoc1)
    ).map(navStateMap);

    const nav2$ = Observable.merge(
        updateDoc2.$,
        updateBothDocs.$.map(pickDoc2)
    ).map(navStateMap);

    const nav0$ = Observable.combineLatest(
        nav1$, nav2$, (nav1State, nav2State) => ({
            // display a "summary" of current page num
            currentPageNum: `[nav1: ${nav1State.currentPageNum}, nav2: ${nav2State.currentPageNum}]`,
            pages: nav1State.pages,
        })
    );

    // let nav0 state stream follow the latest of nav1 and nav2,
    const viewer1 = run(viewer, document.querySelector('#viewer1'))(viewer1$, updateDoc1);
    const viewer2 = run(viewer, document.querySelector('#viewer2'))(viewer2$, updateDoc2);
    const nav1 = run(nav, document.querySelector('#nav1'))(nav1$, updateDoc1);
    const nav2 = run(nav, document.querySelector('#nav2'))(nav2$, updateDoc2);

    const nav0 = run(nav, document.querySelector('#nav0'))(nav0$, updateBothDocs);

})());
