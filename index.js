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
    // .alias('')
    .arguments('[folderNames]')
    .description('调用mvn编译指定目录的java工程'.green)
    .action(function (folderNames) {
        require('./cmd/install').install(folderNames);
    }).on('--help', function () {
        console.log('  Examples:'.yellow);
        console.log();
        console.log('   $: install > 编译当前目录工程'.blue);
        console.log('   $: install folderNameA;folderNameB > 编译当前目录指定的folderNameA和folderNameB的工程'.blue);
    });

program.parse(process.argv);
