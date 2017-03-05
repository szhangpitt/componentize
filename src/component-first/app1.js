const nav = require('./components/nav');
const navviewer = require('./components/nav-viewer');
const xdispatch = require('./lib/x-dispatch');
const xxdispatch = require('./lib/x-dispatch').xxdispatch;
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

    const docStateMap = (singleDocState) => {
        return {
            pages: singleDocState.document.pages,
            currentPageNum: singleDocState.currentPageNum,
        };
    };

    // const doc1Channel = xdispatch(pickDoc1(appState), reduceSingleDoc);
    // const doc2Channel = xdispatch(pickDoc2(appState), reduceSingleDoc);
    // const doc0Channel = xdispatch(appState, reduceAllDocsCurrentPageNum);
    const singleReducerDispatch = xxdispatch(reduceSingleDoc);
    const allReducerDispatch = xxdispatch(reduceAllDocsCurrentPageNum);
    const doc1Channel = singleReducerDispatch(pickDoc1(appState));
    const doc2Channel = singleReducerDispatch(pickDoc2(appState));
    const doc0Channel = allReducerDispatch(appState);

    // let doc0Channel also control doc1 state
    const doc1$ = Observable.merge(
        doc1Channel.$,
        doc0Channel.$.map(pickDoc1)
    ).map(docStateMap);

    // let doc0Channel also control doc2 state
    const doc2$ = Observable.merge(
        doc2Channel.$,
        doc0Channel.$.map(pickDoc2)
    ).map(docStateMap);

    // let nav0 state stream follow the latest of doc1 and doc2,
    const nav0$ = Observable.combineLatest(
        doc1$, doc2$, (doc1State, doc2State) => ({
            // display a "summary" of current page num
            currentPageNum: `[doc1: ${doc1State.currentPageNum}, doc2: ${doc2State.currentPageNum}]`,
            pages: doc1State.pages,
        })
    );

    const navviewer1 = run(navviewer, document.querySelector('#navviewer1'))(doc1$, doc1Channel);
    const navviewer2 = run(navviewer, document.querySelector('#navviewer2'))(doc2$, doc2Channel);

    const nav0 = run(nav, document.querySelector('#nav0'))(nav0$, doc0Channel);

})());
