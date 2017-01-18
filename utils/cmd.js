/**
 * Created by Zxy on 2016/11/24.
 */

var process = require('child_process');

module.exports.exe = function (cmd, cb) {
    try {
        process.exec(cmd, {encoding: 'utf-8'}, function (error, stdout, stderr) {
            if (error != null) {
                console.log(JSON.stringify(error));
                console.info((cmd + ' 无效的命令').yellow);
            }
            console.log(stdout);
            cb();
        });
    } catch (e) {
        console.log(('执行 ' + cmd + ' 异常').red);
        cb();
    }
};