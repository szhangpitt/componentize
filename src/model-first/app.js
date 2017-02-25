const EventEmitter = require('events');
const $ = require('jquery');


function DataModel (input) {

    this.document = input.document;
    this.currentPageNum = input.currentPageNum;

    this.emitter = new EventEmitter();
}

DataModel.prototype.setCurrentPageNum =
function (pageNum) {
    this.currentPageNum = pageNum;
    this.emitter.emit('currentPageNum', pageNum);
};

DataModel.prototype.onCurrentPageNum =
function (cb) {
    var self = this;
    this.emitter.on('currentPageNum', function () {
        cb(self.currentPageNum);
    });
};

((function ModelFirstApplication (argument) {
    var dataModel = new DataModel({
        document: {
            pages: [
                "This is some fake content of a pdf document...",
                "And some other fake content...",
                "The last page..."
            ]
        },
        currentPageNum: 0,
    });

    var viewer = new Viewer(dataModel, $('#viewer'));
    var nav = new Navigator(dataModel, $('#nav1'));
    var nav = new Navigator(dataModel, $('#nav2'));

    console.log(viewer);
    console.log(nav);
})());


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
