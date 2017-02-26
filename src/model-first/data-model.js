const EventEmitter = require('events');

function DataModel (input) {
    this.state = input;
    this.emitter = new EventEmitter();
}

DataModel.prototype.getDocument =
function (docIndex) {
    var i = Array.isArray(docIndex) ? 0 : docIndex;
    return this.state[i];
}

DataModel.prototype.getCurrentPageNum =
function (docIndex) {
    var i = Array.isArray(docIndex) ? 0 : docIndex;
    return this.state[i].currentPageNum;
};

DataModel.prototype.setCurrentPageNum =
function (pageNum, docIndex) {
    var self = this;
    var dis = [].concat(docIndex);
    dis.forEach(function (di) {
        self.state[di].currentPageNum = pageNum;
        self.emitter.emit('currentPageNum', pageNum, di);
    });
};

DataModel.prototype.onCurrentPageNum =
function (cb) {
    var self = this;
    self.emitter.on('currentPageNum', function (pageNum, docIndex) {
        cb(pageNum, docIndex);
    });
};

module.exports = DataModel;
