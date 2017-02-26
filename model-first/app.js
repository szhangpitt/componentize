const $ = require('jquery');
const Viewer = require('./viewer');
const Navigator = require('./nav');
const DataModel = require('./data-model');

((function ModelFirstApplication () {
    var dataModel = new DataModel([{
        document: {
            pages: [
                "This is some fake content of a pdf document...",
                "And some other fake content...",
                "The last page..."
            ]
        },
        currentPageNum: 0,
    }, {
        document: {
            pages: [
                "Another document!",
                "And some other fake content...",
                "The last page..."
            ]
        },
        currentPageNum: 0,
    }]);

    var viewer1 = new Viewer(dataModel, 0, $('#viewer1'));
    var viewer2 = new Viewer(dataModel, 1, $('#viewer2'));

    var nav1 = new Navigator(dataModel, 0, $('#nav1'));
    var nav2 = new Navigator(dataModel, 1, $('#nav2'));

    var nav0 = new Navigator(dataModel, [0, 1], $('#nav0'));

})());
