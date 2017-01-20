/**
 * Created by Zxy on 2016/11/24.
 */
var process = require('child_process');
var waitConsole = require('./waitConsole');

module.exports.exe = exe;

function exe(cmd, cb) {
    waitConsole.startWait();
    try {
        process.exec(cmd, {encoding: 'utf-8'}, function (error, stdout, stderr) {
            waitConsole.stopWait();
            var flag = true;
            if (error != null) {
                if (error.code == 1) {
                    console.info('Command failed to perform or invalid: '.red + ('`' + cmd + '`').yellow);
                    flag = false;
                }
            }
            console.log(stdout);
            cb(flag);
        });
    } catch (e) {
        waitConsole.stopWait();
        console.log('Execute the command error '.red + ('`' + cmd + '`').red);
        cb(false);
    }
}