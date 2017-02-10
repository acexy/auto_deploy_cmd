/**
 * Created by Zxy on 17/01/20.
 */

var fs = require('fs');
var remoteCommand = require('../utils/remoteCommandExec');
var path = require('path');
var gulp = require('gulp');
var sftp = require('gulp-sftp');
var os = require('os');

const baseRemotePath = '/home/dev/autoDeploy/source';

module.exports.publish = function (folderNames, env) {

    if (env.split('/').length != 3) {
        console.log('The `env` parameter is incorrect'.red);
        return;
    }

    console.log('Specifies the target directory location'.yellow);
    console.log('Check whether there are the following folders ↓'.cyan);
    console.log();

    var folderArray = folderNames.split(';').map(String);
    var flag;
    var checkFlag = true;
    var folderPath;
    var files;
    var jarPaths = [];
    var jarNames = [];

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
                    jarNames.push(file);
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
        console.log('All folders and `*.jar` are exists , will publish the following jars ↓'.green);
        console.log();
        jarPaths.forEach(function (path) {
            console.log(('   ' + path).green);
        });
        console.log();
        console.log('Check if all jars are in compliance with specifications'.cyan);
        if (jarPaths.length > 3) {
            console.log('Up to 3 resources can be updated: app/*.jar or lib/*.api.jar or lib/*.common.jar'.red);
            return;
        } else {
            var appCount = 0;
            jarPaths.forEach(function (jarPath) {
                if (jarPath.indexOf('api') == -1 && jarPath.indexOf('common') == -1) {
                    appCount++;
                }
            });
            if (appCount > 1) {
                console.log('Up jars resources have too many app/*.jar'.red);
                return;
            } else {
                console.log('All jars resource verification through')
            }
        }
        console.log();
        remoteCommand.exe('cd ' + baseRemotePath + '/' + env, function (err, sData, eData) {
            if (err != null) {
                console.log('Check the specified target location error'.red);
                return;
            }
            if (eData != null) {
                console.log(('The specified target location is invalid: ' + env).red);
                return;
            }
            remoteCommand.exe('tree ' + baseRemotePath + '/' + env + ' -d', function (err, sData, eData) {
                if (err != null) {
                    console.log('Get server files list error'.red);
                    return;
                }
                console.log('Directory structure for the current server ↓'.yellow);
                console.log(sData.green);

                var deployTmpPath = path.join(os.tmpdir(), 'deploy');

                var appPath = path.join(deployTmpPath, 'app');
                var libPath = path.join(deployTmpPath, 'lib');

                if (fs.existsSync(deployTmpPath)) {
                    rmrf(deployTmpPath);
                }
                try {
                    fs.mkdirSync(deployTmpPath);
                } catch (e) {
                }
                try {
                    fs.mkdirSync(appPath);
                } catch (e) {
                }
                try {
                    fs.mkdirSync(libPath);
                } catch (e) {
                }

                forEachJarPaths(jarPaths, libPath, appPath, jarNames, 0, deployTmpPath, env);
            });
        });
    }
};

function forEachJarPaths(jarPaths, libPath, appPath, jarNames, index, deployTmpPath, env) {

    var jarPath = jarPaths[index];

    var sfPath;
    if (jarPath.indexOf('api') != -1 || jarPath.indexOf('common') != -1) {
        sfPath = libPath;
    } else {
        sfPath = appPath;
    }
    var rStream = fs.createReadStream(jarPath);

    rStream.pipe(
        fs.createWriteStream(path.join(sfPath, jarNames[index]))
    );

    rStream.on('end', function () {
        index++;
        if (index == jarPaths.length) {
            gulp.src(path.join(deployTmpPath, '**', '*'))
                .pipe(sftp({
                        host: '10.24.248.120',
                        port: 22,
                        username: 'dev',
                        password: 'devfroad',
                        remotePath: baseRemotePath + '/' + env
                    })
                );
        } else {
            forEachJarPaths(jarPaths, libPath, appPath, jarNames, index, deployTmpPath, env);
        }
    });

}

function rmrf(rootPath) {
    var files = fs.readdirSync(rootPath);
    var chiPath;
    files.forEach(function (file) {
        chiPath = path.join(rootPath, file);
        if (fs.statSync(chiPath).isDirectory()) {
            rmrf(chiPath);
        } else {
            fs.unlinkSync(chiPath);
        }
    })
}