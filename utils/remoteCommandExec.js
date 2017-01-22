/**
 * Created by Zxy on 17/01/22.
 */

var Client = require('ssh2').Client;


module.exports.exe = function (cmd, cb) {
    var conn = new Client();
    conn.on('ready', function () {
        conn.exec(cmd, function (err, stream) {
            if (err) {
                cb(err, null, null);
                return;
            }
            var sData, eData = null;
            stream.on('close', function (code, signal) {
                // console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
                cb(null, sData, eData);
            }).on('data', function (data) {
                sData = data.toString();
            }).stderr.on('data', function (data) {
                eData = data.toString();
            });
        });
    }).on('error', function (err) {
        cb(err, null, null);
    }).connect({
        host: '10.24.248.120',
        port: 22,
        username: 'dev',
        password: 'devfroad',
        algorithms: {
            hmac: [
                'hmac-sha2-256',
                'hmac-sha2-512',
                'hmac-sha1',
                'hmac-md5',
                'hmac-sha2-256-96',
                'hmac-sha2-512-96',
                'hmac-ripemd160',
                'hmac-sha1-96',
                'hmac-md5-96'
            ]
        }
    });
};