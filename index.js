/**
 * Created by Zxy on 17/01/18.
 */

var program = require('commander');
require('colour');

var path = require('path');

program
    .version(require(path.join(__dirname, '.', 'package.json')).version);

program
    .command('install')
    .alias('build')
    .arguments('[folderNames]')
    .description('This command will use `mvn` to build java project'.green)
    .action(function (folderNames) {
        require('./cmd/install').install(folderNames);
    }).on('--help', function () {
        console.log('  Examples:'.yellow);
        console.log();
        console.log('   $: install > Build current dir project'.blue);
        console.log('   $: install folderNameA;folderNameB > Build projects of folderNameA and folderNameB'.blue);
    });

program.parse(process.argv);
