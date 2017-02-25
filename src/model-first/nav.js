var $ = require('jquery');

function Navigator (appDataModel, target) {
    var self = this;
    self.currentPageNum = appDataModel.currentPageNum;
    self.dom = getDom(self.currentPageNum);

    self.dom.on('click', 'button', function (e) {
        var pageNumAttr = $(e.target).attr('data-page-num');

        appDataModel.setCurrentPageNum(+pageNumAttr);
    });

    appDataModel.onCurrentPageNum(function (pageNum) {
        self.dom.find('p > span').html(pageNum);
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