/**
 * Created by Zxy on 17/01/18.
 */

var path = require('path');
var cmd = require('../utils/cmd');
var fs = require('fs');

module.exports.install = function (folderNames) {
    if (typeof folderNames == 'undefined') {
        console.log('Do not specify a directory , Deal with the current directory by default: '.yellow + '%s'.green, __dirname);
        cmd.exe('mvn install', function (flag) {
        })
    } else {
        let folderArray = folderNames.split(';').map(String);
        console.log('Check whether there are the following folders ↓'.cyan);
        console.log();
        let flag;
        let info;
        let color;
        let checkFlag = true;
        for (var index in folderArray) {
            flag = fs.existsSync(path.join(process.cwd(), folderArray[index]));
            console.log(('  folder: ' + folderArray[index] + ' ' + (flag ? '√' : '×'))[flag ? 'green' : 'red']);
            if (!flag) {
                checkFlag = false;
            }
        }
        console.log();
        if (!checkFlag) {
            console.log('Some folders are not exists, please check them again ↑'.yellow);
        } else {
            console.log('All folders are exists'.green);
        }
    }
};