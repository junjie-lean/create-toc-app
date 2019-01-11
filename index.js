#!/usr/bin/env node

process.env.NODE_PATH = __dirname + '/node_modules/'

const program = require('commander');
console.log(process.pid)

program.version(require('./package').version)
    .option('-n, --name', 'create file')
    .parse(process.argv);

if (program.name) {
    console.log('name:', program.name);
}

if (!program.args.length) {
    program.help()
}
