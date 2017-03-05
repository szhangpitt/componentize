const patch = require('./patch');

module.exports =
function makePatchVnode (vnodeFn, target) {
    if (!target) {
        throw new Error('[run-component] target does not exist!');
    }

    return function patchVnode (state$, dispatch) {
        const patchSubscription = state$
        .distinct()
        .map((state) => vnodeFn(state, dispatch))
        .startWith(target)
        .pairwise()
        .subscribe(([oldVnode, newVnode]) => patch(oldVnode, newVnode));

        return patchSubscription;
    };
};

