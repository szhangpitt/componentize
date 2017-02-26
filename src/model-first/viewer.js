var $ = require('jquery');

function Viewer (appDataModel, docIndex, target) {
    var self = this;
    self.pages = appDataModel.getDocument(docIndex).document.pages;
    self.currentPageNum = appDataModel.getCurrentPageNum(docIndex);

    self.dom = getDom(self.pages, self.currentPageNum);

    render(self.dom);

    self.dom.on('click', 'section > a', function (e) {
        var indexAttr = $(e.target).closest('section').attr('data-index');
        appDataModel.setCurrentPageNum(+indexAttr, docIndex);
    });

    appDataModel.onCurrentPageNum(function (pageNum, di) {
        docIndex === di && self.dom.find(`section`).removeClass('active');
        docIndex === di && self.dom.find(`section[data-index="${pageNum}"]`).addClass('active');
    });

    function getDom (pages, pageNum) {
        var html = `<acticle>` +
            pages
            .map((str, index) =>
                `<section data-index="${index}" class="${index === pageNum ? 'active': ''}">` +
                    `<p>${str}</p>` +
                    `<a href="#">go here</a>` +
                `</section>`
            )
            .join('') +
        `</acticle>`;

        return $(html);
    }


    function render (dom) {
        $(target).append(dom);
    }
}

module.exports = Viewer;
