/**
 * Created by Zxy on 17/02/09.
 */

var remoteCommand = require('../utils/remoteCommandExec');

const baseRemotePath = '/home/dev/autoDeploy/source';
const baseConfigPath = '/home/dev/autoDeploy/config/';

module.exports.upgrade = function (cVersion, tVersion, env) {
    if (tVersion == cVersion) {
        console.log('The upgraded version number can not be the same'.red);
        return;
    }
    if (env.split('/').length != 3) {
        console.log('The `env` parameter is incorrect'.red);
        return;
    }
    remoteCommand.exe('cd ' + baseRemotePath + '/' + env, function (err, sData, eData) {

        if (err != null || eData != null) {
            console.log(('The specified target location does not exist: `' + env + '`').red);
            return;
        } else {
            console.log(('The specified destination location is valid: `' + env + '`').green);
        }
        var servers;
        remoteCommand.exe('cat ' + baseConfigPath + 'servers.json', function (err, sData, eData) {

            if (err != null || eData != null) {
                console.log('Failed to get servers configuration information'.red);
                return;
            }
            servers = JSON.parse(sData);
            remoteCommand.exe('cat ' + baseConfigPath + 'envs.json', function (err, sData, eData) {

                if (err != null || eData != null) {
                    console.log('Failed to get servers configuration information'.red);
                    return;
                }

                var envs = JSON.parse(sData);
                var envKeys = env.split('/');
                console.log();
                console.log('The remote servers configuration for the target environment is as follows ↓'.yellow);

                var ser = envs[envKeys[0]][envKeys[1]][envKeys[2]];
                console.log(JSON.stringify(ser, null, 2));
                var serKeys = Object.keys(ser);
                var serKey;

                for (var i = 0; i < serKeys.length; i++) {
                    serKey = serKeys[i];
                    var server = servers[serKeys];

                    remoteCommand.exeArgv('cd ' + ser[serKey].remotePath + '&&sed -n \'/' + cVersion + '/p\'' +
                        ' ' + ser[serKey].cmd.startShellName, function (err, sData, eData) {
                        if (err != null || eData != null) {
                            console.log(('Upgrading `' + ser[serKey].cmd.startShellName + '` failed server: ' + serKey).red);
                            return;
                        }
                        if (sData == undefined || sData == null) {
                            console.log(('The specified current version number is wrong: ' + cVersion).red);
                            return;
                        }

                        remoteCommand.exeArgv('cd ' + ser[serKey].remotePath + '&&sed -i \'s/' + cVersion + '/' + tVersion + '/\'' +
                            ' ' + ser[serKey].cmd.startShellName, function (err, sData, eData) {
                            if (err != null || eData != null) {
                                console.log(('Upgrading `' + ser[serKey].cmd.startShellName + '` failed server: ' + serKey).red);
                                return;
                            } else {
                                console.log(('The `' + ser[serKey].cmd.startShellName + '` update completed from server: ' + serKey).green);
                            }

                            remoteCommand.exeArgv('cd ' + ser[serKey].remotePath + '&&find . -name \'*-' + cVersion + '-SNAPSHOT.jar\' | awk -F \'/\' \'{print}\' | xargs -i{} rm -rf {}', function (err, sData, eData) {
                                if (err != null || eData != null) {
                                    console.log(('Delete `*.jar` failed').red);
                                    return;
                                }
                                console.log(('Delete `*-' + cVersion + '-SNAPSHOT.jar` success from server: ' + serKey).green);
                            }, server);

                        }, server);
                    }, server);
                }
            });
        });
    });
};