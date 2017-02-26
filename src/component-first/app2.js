const patch = require('./lib/patch');
const viewerV = require('./components/viewer').vnode;

((() => {
    const app2State = {
        cards: [
            'Don\'t cry over spilled milk',
            'One smart cookie',
            'Put all eggs in one basket',
            'Spill the beans',
        ],
        startIndex: 0,
    };

    const totalCount = app2State.cards.length;
    let currentIndex = app2State.startIndex;
    let oldNode = document.querySelector('#target');

    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalCount;
        const cardVnode = viewerV({
            pages: app2State.cards,
            currentPageNum: currentIndex,
        });
        patch(oldNode, cardVnode);
        oldNode = cardVnode;
    }, 1000);

})());

