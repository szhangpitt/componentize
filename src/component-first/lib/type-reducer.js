const typeReducer =
(typeFnMap) =>
(oldState, action) => {
    return Object.keys(typeFnMap)
    .reduce((state, actionType) => {
        return actionType !== action.type
            ? state
            : typeFnMap[actionType](state, action);
    }, oldState);
};

module.exports = typeReducer;
