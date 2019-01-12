#!/usr/bin/env node

/*
 * @Author: junjie.lean 
 * @Date: 2019-01-12 00:05:28 
 * @Last Modified by: lean
 * @Last Modified time: 2019-01-12 18:06:08
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
                    deleteFileOrFolder(path.join(thisCwd, dir))
                    DIRNAME = dir;
                    break;
                } else {
                    return false
                }
            }
        }
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
                    ['install'],
                    {
                        cwd:
                            path.join(thisCwd, DIRNAME),
                        encoding: "utf8",
                        shell: process.platform == "win32"
                    });
                loadingline.start(" Install dependencies success,Eject project");
                let ejectProject = cp.spawnSync("npm",
                    ["run", "eject"],
                    {
                        cwd:
                            path.join(thisCwd, DIRNAME),
                        encoding: "utf8",
                        shell: process.platform == "win32"
                    }
                )
                signale.success("Now you can start your project,Good luck, Have fun!");
            }
        })
    } else {
        throw new Error('need dirname')
    }
})()


//删除指定文件或文件夹
function deleteFileOrFolder(_path) {
    let stat = fs.statSync(_path);
    if (stat.isDirectory()) {
        let childFiles = fs.readdirSync(_path);
        if (childFiles.length == 0) {
            //空文件夹
            fs.rmdirSync(_path)
        } else {
            for (let childFile of childFiles) {
                deleteFileOrFolder(path.join(_path, childFile))
            }
        }

    } else {
        fs.unlinkSync(_path);
    }

    if (fs.readdirSync(_path).length > 0) {
        deleteFileOrFolder(_path)
    } 
}



// https://github.com/junjie-lean/falseworkWithNext7.git