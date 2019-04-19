#!/usr/bin/env node

/*
 * @Author: junjie.lean
 * @Date: 2019-04-19 10:16:17
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2019-04-19 14:52:45
 */

/**
 * @description CTA v2 版本，增加对serverless的支持；
 */

const program = require("commander");
const download = require("download-git-repo");
const path = require("path");
const fs = require("fs");

const GIT_OPTION = {
  serverless: {
    branch: "alpha",
    addr: "junjie-lean/toc.serverless"
  },
  server: {
    branch: "alpha",
    addr: "junjie-lean/toc"
  }
};



/**
 * @description 主程
 */
program.version(require("./package.json").version, "-v,--version");
program.option("-s --serverless", "ues toc have server").action(dir => {
  //判断dirname是否合法
  if (!isAllowCreate()) {
    throw new Error("not all");
  }

  //判断当前文件夹是否有同名文件夹
  if (checkRepeat(dir)) {
    console.log("无重名");
    createFloder(dir);
    getTemplate(dir, program.serverless);
  } else {
    console.warn("文件夹重名！当前目录下已有", dir);
    return false;
  }
});

program.parse(process.argv);

/**
 * @description 判断dirname是否合法
 * @param {String} dirname
 */
function isAllowCreate(dirname) {
  return true;
}

/**
 * @description 创建文件目录
 * @param {String} dirname
 */
function createFloder(dirname) {
  console.log("创建文件夹");
  fs.mkdirSync(dirname);
}

/**
 * @description 判断是否有同名文件夹
 * @param {String} dirname
 * @returns {Bool}
 */
function checkRepeat(dirname) {
  console.log("判断是否重复");
  //返回 当前是否有该文件夹
  return (
    undefined ===
    fs
      .readdirSync(process.cwd(), "utf8")
      .filter(file => {
        //过滤出不以“.”开头并且是文件夹的文件目录
        return (
          file[0] !== "." &&
          fs.statSync(path.join(process.cwd(), file)).isDirectory()
        );
      })
      .find((dir, index, arr) => {
        return dir == dirname;
      })
  );
}

/**
 * @description 拉取模板
 */
function getTemplate(dirname, serverless) {
  console.log("开始拉取模板");
  if (serverless) {
    console.log("开始拉取serverless模板");
    download(
      `${GIT_OPTION.serverless.addr}#${GIT_OPTION.serverless.branch}`,
      path.join(process.cwd(), dirname),
      err => {
        if (err) {
          console.log(err);
        } else {
          console.log("down");
        }
      }
    );
  } else {
    console.log("开始拉取带server模板");
    download(
      `${GIT_OPTION.server.addr}#${GIT_OPTION.server.branch}`,
      path.join(process.cwd(), dirname),
      err => {
        if (err) {
          console.log(err);
        } else {
          console.log("down");
        }
      }
    );
  }
}
