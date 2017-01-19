/**
 * Created by Zxy on 17/01/19.
 */
var fs = require('fs');
var path = require('path');

var pomPath = [];
function searchPOM(dirPath) {
    var files = fs.readdirSync(dirPath);
    var filePath;
    files.forEach(function (fileName) {
        filePath = path.join(dirPath, fileName);
        if (fs.statSync(filePath).isDirectory()) {
            searchPOM(filePath);
        } else if (fileName == 'pom.xml') {
            pomPath.push(filePath);
        }
    })
}

module.exports.upgradeVersion = function (version) {
    var rootDirPath = process.cwd();
    searchPOM(rootDirPath);
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
                    return;
                }
                changeContent(rootDirPath, path, data, version);
            });
        });
    }
};


function changeContent(rootDirPath, path, content, version) {
    var newContent = content.replace(/<version>?\d.(\d+.)*\d-SNAPSHOT<\//g, '<version>' + version + '-SNAPSHOT<');
    fs.writeFile(path, newContent, 'utf-8', function (err) {
        if (err) {
            console.log('   ' + String(path.split(rootDirPath)[1]).substring(1) + ' ×'.red);
        } else {
            console.log('   ' + String(path.split(rootDirPath)[1]).substring(1) + ' √'.green);
        }
    });

}