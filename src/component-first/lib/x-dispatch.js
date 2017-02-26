const Rx = require('rxjs/Rx');

module.exports =
function makeDispatch (targetState, reducer) {
    const targetState$ = new Rx.BehaviorSubject(targetState);

    const dispatch = function dispatch (action) {
        const oldState = targetState$.getValue();
        const newState = reducer(oldState, action);
        targetState$.next(newState);
    };

    dispatch.$ = targetState$;
    dispatch.targetState$ = targetState$;

    return dispatch;
};
