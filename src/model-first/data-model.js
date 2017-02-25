const EventEmitter = require('events');

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

module.exports = DataModel;
