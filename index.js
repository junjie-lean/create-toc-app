#!/usr/bin/env node

/*
 * @Author: junjie.lean 
 * @Date: 2019-01-12 00:05:28 
 * @Last Modified by:   lean 
 * @Last Modified time: 2019-01-12 00:05:28 
 */

const commander = require('commander');
const path = require('path');
const fs = require('fs');
const download = require('download-git-repo')
const signale = require('signale');
const loading = require('loading-cli');
const chalk = require('chalk');

let dirname = "";
let gitoption = {
    branch: "alpha",
    addr: "junjie-lean/falseworkWithNext7"
}


commander.version(require('./package').version, '-v, --version')
    .option('-h, --help', 'help')
    .arguments('<dirname>')
    .action((dir) => {
        dirname = dir;
    })
    .parse(process.argv);


(function () {
    if (dirname) {
        signale.start(`Start creating projects:"${dirname}" in "${path.join(process.cwd(), dirname)}" `);
        fs.mkdirSync(path.join(process.cwd(), dirname), { recursive: true });
        let load;
        download(`${gitoption.addr}#${gitoption.branch}`, path.join(process.cwd(), dirname), (err) => {
            if (err) {
                signale.error("Can not clone template from remote,Check your network!");
            } else {
                load.stop();
                load.clear();
                signale.success("Now you can start your project,Good luck, Have fun!");
            }
        })
        load = loading('Creating...').start();
    } else {
        throw new Error('need dirname')
    }
})()


// https://github.com/junjie-lean/falseworkWithNext7.git