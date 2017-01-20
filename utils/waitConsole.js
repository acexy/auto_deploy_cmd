var readline = require('readline');

const outputStream = process.stdout;

const waitChar = ['-'.green, '\\'.yellow, '|'.blue, '/'.black];

var index = 0;
var content;
var cursorColumns, cursorRows = 0;
var occ;

var interval;

function getContentOccRowColumns(content) {
    var consoleMaxColumns = outputStream.columns;
    var strDisplayLength = getDisplayLength(content);
    var rows = parseInt(strDisplayLength / consoleMaxColumns, 10);
    var columns = parseInt(strDisplayLength - rows * consoleMaxColumns, 10);
    return {
        rows: rows,
        columns: columns
    }
}

function getDisplayLength(content) {
    var realLength = 0, len = content.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = content.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

module.exports.startWait = function () {
    interval = setInterval(function () {
        content = 'Please wait ... '.red + waitChar[index];
        readline.moveCursor(outputStream, cursorColumns * -1, cursorRows * -1);
        readline.clearScreenDown(outputStream);
        process.stdout.write(content);
        occ = getContentOccRowColumns(content);
        cursorColumns = occ.columns;
        cursorRows = occ.rows;
        index++;
        index = index > 3 ? 0 : index;
    }, 100);
};

module.exports.stopWait = function () {
    readline.moveCursor(outputStream, cursorColumns * -1, cursorRows * -1);
    readline.clearScreenDown(outputStream);
    clearInterval(interval);
};
