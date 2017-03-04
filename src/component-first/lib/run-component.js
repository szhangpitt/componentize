const patch = require('./patch');

module.exports =
function makePatchVnode (vnodeFn, target) {
    return function patchVnode (state$, dispatch) {
        const vnodeSub = state$
        .distinct()
        .map((state) => vnodeFn(state, dispatch))
        .startWith(target)
        .pairwise()
        .subscribe(([oldVnode, newVnode]) => patch(oldVnode, newVnode));

        return vnodeSub;
    };
};

