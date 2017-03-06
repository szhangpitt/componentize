const typeReducer = require('./lib/type-reducer');
const xdispatch = require('./lib/x-dispatch');
const assign = Object.assign;

const appState = [{
    document: {
        id: 'abc',
        pages: [
            'This is some fake content of a pdf document...',
            'And some other fake content...',
            'The last page...',
        ],
    },
    currentPageNum: 1,
}, {
    document: {
        id: 'def',
        pages: [
            'Another doc!',
            'And some other fake content...',
            'The last page...',
        ],
    },
    currentPageNum: 2,
}];

const turnPageReducer = typeReducer({
    'turn_page': (state, action) =>
        state.map((doc) =>
            action.data.id === doc.document.id
                ? assign({}, doc, { currentPageNum: action.data.page })
                : doc
        ),
    'force_page': (state, action) =>
        state.map((doc) =>
            assign({}, doc, {currentPageNum: action.data.page })
        ),
});

const turnPageDispatch = xdispatch(appState, turnPageReducer);

const turnDoc1ToPage2 = { type: 'turn_page', data: {id: 'abc', page: 2}};
const forceAllToPage0 = { type: 'force_page', data: {page: 0}};

turnPageDispatch.$.subscribe(console.log.bind(console, 'state change'));

turnPageDispatch(turnDoc1ToPage2);
turnPageDispatch(forceAllToPage0);

