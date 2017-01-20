/**
 * Created by Zxy on 17/01/20.
 */

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var sftp = require('gulp-sftp');

module.exports.publish = function (folderNames, env) {

    console.log('Specifies the target directory location'.yellow);
    console.log('Check whether there are the following folders ↓'.cyan);
    console.log();

    var folderArray = folderNames.split(';').map(String);
    var flag;
    var checkFlag = true;
    var folderPath;
    var files;
    var jarPaths = [];

    for (var index in folderArray) {
        folderPath = path.join(process.cwd(), folderArray[index]);
        flag = fs.existsSync(folderPath);
        if (flag) {
            folderPath = path.join(folderPath, 'target');
            files = fs.readdirSync(folderPath);
            var jars = [];
            files.forEach(function (file) {
                if (file.endsWith('.jar')) {
                    jars.push(file);
                    jarPaths.push(path.join(folderPath, file));
                }
            });
            var len = jars.length;
            if (len == 0) {
                console.log(('  folder: ' + folderArray[index] + ' <can\'t find any `*.jar`> ×').red);
                checkFlag = false;
            } else if (len == 1) {
                console.log(('  folder: ' + folderArray[index] + ' √').green);
            } else {
                checkFlag = false;
                console.log(('  folder: ' + folderArray[index] + ' <find more then one `*.jar`> ?').yellow);
            }
        } else {
            checkFlag = false;
            console.log(('  folder: ' + folderArray[index] + ' ×').red);
        }

        if (!flag) {
            checkFlag = false;
        }
    }
    console.log();
    if (!checkFlag) {
        console.log('Some folders are not exists or `*.jar` illegal, please check them again ↑'.yellow);
    } else {
        console.log('All folders and `*.jar` are exists , will publish the flowing jars ↓'.green);
        console.log();
        jarPaths.forEach(function (path) {
            console.log(('   ' + path).blue);
        });
    }
};