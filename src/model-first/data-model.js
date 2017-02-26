const EventEmitter = require('events');

function DataModel (input) {
    this.state = input;
    this.emitter = new EventEmitter();
}

DataModel.prototype.getDocument =
function (docIndex) {
    return this.state[docIndex];
}

DataModel.prototype.getCurrentPageNum =
function (docIndex) {
    return this.state[docIndex].currentPageNum;
};

DataModel.prototype.setCurrentPageNum =
function (pageNum, docIndex) {
    this.state[docIndex].currentPageNum = pageNum;
    this.emitter.emit('currentPageNum', pageNum, docIndex);
};

DataModel.prototype.onCurrentPageNum =
function (cb) {
    var self = this;
    self.emitter.on('currentPageNum', function (pageNum, docIndex) {
        cb(pageNum, docIndex);
    });
};

module.exports = DataModel;
