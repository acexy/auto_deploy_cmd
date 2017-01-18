/**
 * Created by Zxy on 17/01/18.
 */

var path = require('path');
var cmd = require('../utils/cmd');
var fs = require('fs');

module.exports.install = function (folderNames) {
    if (typeof folderNames == 'undefined') {
        console.log('未指定编译的文件夹名,默认编译当前目录===> '.yellow + '%s'.green, __dirname);
        cmd.exe('mvn install', function () {
            console.log('编译文件完成');
        })
    } else {
        let folderArray = folderNames.split(';').map(String);
        console.log('check folder exists:'.cyan);
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
            console.log('some folders is not exists, please check it again'.yellow);
        } else {
            console.log('all folders are exists'.green);
        }
    }
};