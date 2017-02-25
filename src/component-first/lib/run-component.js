const patch = require('./patch');

module.exports =
function makePatchVnode (vnodeFn) {
    return function patchVnode (state$, target, dispatch) {
        const vnodeSub = state$
        .map((state) => vnodeFn(state, dispatch))
        .startWith(target)
        .pairwise()
        .subscribe(([oldVnode, newVnode]) => patch(oldVnode, newVnode));

        return vnodeSub;
    };
};

