#!/usr/bin/env node

/*
 * @Author: junjie.lean 
 * @Date: 2019-01-12 00:05:28 
 * @Last Modified by: lean
 * @Last Modified time: 2019-02-04 00:00:13
 */

const commander = require('commander');
const path = require('path');
const fs = require('fs');
const download = require('download-git-repo');
const signale = require('signale');
const ora = require('ora');
const cp = require('child_process');
const chalk = require('chalk');
const readline = require('readline-sync');
let DIRNAME = "";
let gitoption = {
    branch: "alpha",
    addr: "junjie-lean/falseworkWithNext7"
};
let thisCwd = process.cwd();
let loadingline = new ora();
commander.version(require('./package').version, '-v, --version')
    .option('-h, --help', 'help')
    .arguments('<dirname>')
    .action((dir) => {
        let dirlist = fs.readdirSync(thisCwd, 'utf8');
        //当前文件夹查询是否有同名文件：
        for (let thisChildDir of dirlist) {
            if (thisChildDir === dir) {
                //找到同名文件，询问是否覆盖
                let needCoverage = readline.question(chalk.bgRed(`  The "${dir}" is exists in current folder,coverage? y/n  `))
                if (needCoverage && needCoverage == "y") {
                    deleteFolder(path.join(thisCwd, dir));
                    break;
                } else {
                    return false
                }
            }
        }
        DIRNAME = dir;
    })
    .parse(process.argv);


(function () {
    if (DIRNAME) {
        // signale.start(`Start creating projects:"${DIRNAME}" in "${path.join(thisCwd, DIRNAME)}" `);
        loadingline.start(` Start creating projects:"${DIRNAME}" in "${path.join(thisCwd, DIRNAME)}" `)
        fs.mkdirSync(path.join(thisCwd, DIRNAME), { recursive: true });
        let load;
        download(`${gitoption.addr}#${gitoption.branch}`, path.join(thisCwd, DIRNAME), (err) => {
            if (err) {
                console.log(err)
                loadingline.fail(" Can not clone template from remote,Check your network!");
            } else {
                loadingline.stopAndPersist().start(" Creating project success,Install dependencies(This will take some time)...");
                let installDependencies = cp.spawnSync('npm',
                    ['i'],
                    {
                        cwd:
                            path.join(thisCwd, DIRNAME),
                        encoding: "utf8",
                        shell: process.platform == "win32"
                    });
                if (installDependencies.stdout) {
                    console.log(installDependencies.stdout)
                }
                if (installDependencies.stderr) {
                    console.log(installDependencies.stderr)
                }
                loadingline.stop()
                signale.success("Now you can eject your project,Good luck, Have fun!");
            }
        })
    } else {
        throw new Error('need dirname')
    }
})()


//删除指定文件或文件夹
function deleteFolder(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);

        
    }
}
// https://github.com/junjie-lean/falseworkWithNext7.git