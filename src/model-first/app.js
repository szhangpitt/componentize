const $ = require('jquery');
const Viewer = require('./viewer');
const Navigator = require('./nav');
const DataModel = require('./data-model');

((function ModelFirstApplication () {
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

    var viewer1 = new Viewer(dataModel, $('#viewer1'));
    var viewer2 = new Viewer(dataModel, $('#viewer2'));
    var nav = new Navigator(dataModel, $('#nav1'));
    var nav = new Navigator(dataModel, $('#nav2'));

})());
