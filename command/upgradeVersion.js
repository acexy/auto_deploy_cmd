/**
 * Created by Zxy on 17/01/19.
 */
var fs = require('fs');
var path = require('path');
var waitConsole = require('../utils/waitConsole');

var thunkify = require('thunkify');
var co = require('co');

var pomPath = [];

function* searchPOM(dirPath) {
    var files = yield thunkify(fs.readdir).call(fs, dirPath);
    for (var i = 0, len = files.length; i < len; i++) {
        var file = files[i];
        var stat = yield thunkify(fs.stat).call(fs, path.join(dirPath, file));
        if (stat.isDirectory()) {
            yield searchPOM(path.join(dirPath, file));
        } else if (file == 'pom.xml') {
            pomPath.push(path.join(dirPath, file));
        }
    }
}

module.exports.upgradeVersion = function (version) {
    var rootDirPath = process.cwd();
    console.log('Began to search for files'.yellow);
    waitConsole.startWait();
    co(function*() {
        yield searchPOM(rootDirPath);
    }).then(function () {
        waitConsole.stopWait();
        if (pomPath.length == 0) {
            console.log('Failed to find any `pom.xml` file'.red);
        } else {

            console.log('Find the following files:'.green);
            console.log();
            pomPath.forEach(function (path) {
                console.log('   ' + String(path.split(rootDirPath)[1]).substring(1))
            });
            console.log();
            console.log('Begin to update file version number ↓'.yellow);
            console.log();
            pomPath.forEach(function (path) {
                fs.readFile(path, {encoding: 'utf-8'}, function (err, data) {
                    if (err) {
                        console.log(('Read file failed: ' + path).red);
                    } else {
                        changeContent(rootDirPath, path, data, version);
                    }
                });
            });
        }
    });
};


function changeContent(rootDirPath, path, content, version) {
    var suffix = "/";
    var newContent = content.replace(/<version>?\d.(\d+.)*\d-SNAPSHOT<\//g, '<version>' + version + '-SNAPSHOT<' + suffix);
    fs.writeFile(path, newContent, 'utf-8', function (err) {
        if (err) {
            console.log('   ' + String(path.split(rootDirPath)[1]).substring(1) + ' ×'.red);
        } else {
            console.log('   ' + String(path.split(rootDirPath)[1]).substring(1) + ' √'.green);
        }
    });

}