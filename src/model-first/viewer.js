var $ = require('jquery');

function Viewer (appDataModel, target) {
    var self = this;
    self.document = appDataModel.document;
    self.currentPageNum = appDataModel.currentPageNum;

    self.dom = getDom(self.document.pages, self.currentPageNum);

    render(self.dom);

    self.dom.on('click', 'section > a', function (e) {
        var indexAttr = $(e.target).closest('section').attr('data-index');
        appDataModel.setCurrentPageNum(+indexAttr);
    });

    appDataModel.onCurrentPageNum(function (pageNum) {
        self.dom.find(`section`).removeClass('active');
        self.dom.find(`section[data-index="${pageNum}"]`).addClass('active');
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
