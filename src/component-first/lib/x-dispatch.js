module.exports =
function makeDispatch (state$, reduce) {
    return function dispatch (action) {
        const oldState = state$.getValue();
        const newState = reduce(oldState, action);
        state$.next(newState);
    };
};
