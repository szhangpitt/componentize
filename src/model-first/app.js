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

    var viewer = new Viewer(dataModel, $('#viewer'));
    var nav = new Navigator(dataModel, $('#nav1'));
    var nav = new Navigator(dataModel, $('#nav2'));

    console.log(viewer);
    console.log(nav);
})());
