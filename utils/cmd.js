/**
 * Created by Zxy on 2016/11/24.
 */

var process = require('child_process');

module.exports.exe = function (cmd, cb) {
    try {
        process.exec(cmd, {encoding: 'utf-8'}, function (error, stdout, stderr) {
            if (error != null) {
                if (error.code == 1) {
                    console.info('Invalid command: '.red + ('`' + cmd + '`').yellow);
                    cb(false);
                    return;
                }
            }
            console.log(stdout);
            cb(true);
        });
    } catch (e) {
        console.log('Execute the command error '.red + ('`' + cmd + '`').red);
        cb(false);
    }
};