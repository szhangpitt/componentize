const Rx = require('rxjs/Rx');

// state + reducer
// =>
// dispatch(action) => Observable[new state]

// const dispatch123 = xdispatch(state: object, reducer: fn(state, action))
// const state$ = dispatch.$;

// dispatch123(a) ---a1---a2---a3--->
// state$         ---s1---s2---s3--->

module.exports =
function makeDispatch (targetState, targetReducer) {
    const targetState$ = new Rx.BehaviorSubject(targetState);

    const dispatch = function dispatch (action) {
        const oldState = targetState$.getValue();
        const newState = targetReducer(oldState, action);
        targetState$.next(newState);
    };

    dispatch.$ = targetState$;
    dispatch.stream = targetState$;

    return dispatch;
};
