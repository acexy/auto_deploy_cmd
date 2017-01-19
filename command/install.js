/**
 * Created by Zxy on 17/01/18.
 */

var path = require('path');
var cmd = require('../utils/cmd');
var fs = require('fs');

module.exports.install = function (folderNames) {
    if (typeof folderNames == 'undefined') {
        console.log('Deal with the current directory by default: '.yellow + '%s'.green, process.cwd());
        cmd.exe('mvn clean && mvn install', function (flag) {
            if (!flag) {
                console.log('Compile the project failure: command failed to perform or invalid'.red);
            } else {
                console.log('Compile the project successful'.green);
            }
        })
    } else {
        console.log('Specifies the target directory location'.yellow);
        console.log('Check whether there are the following folders ↓'.cyan);
        console.log();
        var folderArray = folderNames.split(';').map(String);
        var flag;
        var checkFlag = true;
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
            console.log('All folders are exists , began to compile all projects'.green);
            mvnInstall(0, folderArray);
        }
    }
};

function mvnInstall(index, folderArray) {
    var cmdStr = 'cd ' + folderArray[index] + ' && mvn clean && mvn install';
    cmd.exe(cmdStr, function (flag) {
        if (flag) {
            console.log(('Project<' + folderArray[index] + '> : compile the complete').green);
        } else {
            console.log(('Project<' + folderArray[index] + '> : Compilation fails').red);
        }
        index++;
        if (index != folderArray.length) {
            mvnInstall(index, folderArray);
        } else {
            console.log('All projects build success'.green)
        }
    })
}