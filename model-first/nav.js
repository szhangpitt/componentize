var $ = require('jquery');

function Navigator (appDataModel, docIndex, target) {
    var self = this;
    self.currentPageNum = appDataModel.getCurrentPageNum(docIndex);
    self.dom = getDom(
        Array.isArray(docIndex)
        ? `[nav1: ${appDataModel.getCurrentPageNum(0)}, nav2: ${appDataModel.getCurrentPageNum(1)}]`
        : self.currentPageNum);

    self.dom.on('click', 'button', function (e) {
        var pageNumAttr = $(e.target).attr('data-page-num');
        appDataModel.setCurrentPageNum(+pageNumAttr, docIndex);
    });

    appDataModel.onCurrentPageNum(function (pageNum, di) {
        (di === docIndex || Array.isArray(docIndex) && docIndex.indexOf(di) !== -1)
            && self.dom.find('p > span').html(pageNum);

        (Array.isArray(docIndex))
            && self.dom
                .find('p > span')
                .html(`[nav1: ${appDataModel.getCurrentPageNum(0)}, nav2: ${appDataModel.getCurrentPageNum(1)}]`)
    });

    render(self.dom);

    function getDom (currentPageNum) {
        var html =
            `<nav>` +
                `<div>` +
                    `<button data-page-num="0">0</button>` +
                    `<button data-page-num="1">1</button>` +
                    `<button data-page-num="2">2</button>` +
                `<div>` +
                `<p>Current page is: <span>${currentPageNum}</span></p>` +
            `</nav>`;
        return $(html);
    }

    function render (dom) {
        $(target).append(dom);
    }
}

module.exports = Navigator;
