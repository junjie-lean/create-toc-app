#!/usr/bin/env node

/*
 * @Author: junjie.lean
 * @Date: 2019-04-19 10:16:17
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2019-04-19 17:51:04
 */

/**
 * @description CTA v2 版本，增加对serverless的支持；
 */

const path = require("path");
const fs = require("fs");
const spawn = require("cross-spawn");
const program = require("commander");
const download = require("download-git-repo");

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

let isDownLoad = false;

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
    createFloder(dir);
    getTemplate(dir, program.serverless);
  } else {
    console.warn("❌   当前目录下已有<" + dir + ">文件夹");
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
  console.log("✔️  开始创建项目结构<" + dirname + ">");
  fs.mkdirSync(dirname);
}

/**
 * @description 判断是否有同名文件夹
 * @param {String} dirname
 * @returns {Bool}
 */
function checkRepeat(dirname) {
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
  if (serverless) {
    console.log("✔️  开始初始化toc.serverless目录结构");
    download(
      `${GIT_OPTION.serverless.addr}#${GIT_OPTION.serverless.branch}`,
      path.join(process.cwd(), dirname),
      err => {
        if (err || isDownLoad) {
          console.log("❌  无法拉取模板");
        } else {
          insDepend(dirname);
        }
      }
    );
  } else {
    console.log("✔️  开始初始化toc目录结构");
    download(
      `${GIT_OPTION.server.addr}#${GIT_OPTION.server.branch}`,
      path.join(process.cwd(), dirname),
      err => {
        if (err || isDownLoad) {
          console.log("❌  无法拉取模板");
        } else {
          insDepend(dirname);
        }
      }
    );
  }
}

/**
 * @description 安装依赖的
 */
function insDepend(dirname) {
  console.log("✔️  项目目录初始化完毕，开始安装依赖");
  //   let insDep = spawn.sync("npm", ["i"], {
  //     cwd: path.join(process.cwd(), dirname),
  //     encoding: "utf8",
  //     shell: process.platform == "win32",
  //     // stdio: ["inherit", "ignore", "pipe"]
  //     stdio: "inherit"
  //   });
  let insDep = spawn.sync("echo", ["nihao "], {
    cwd: path.join(process.cwd(), dirname),
    encoding: "utf8",
    shell: process.platform == "win32",
    // stdio: ["inherit", "ignore", "pipe"]
    stdio: "inherit"
  });

  isDownLoad = true;
  insDep.on("close", (code, signal) => {
    if (code == 0 && !signal) {
      console.log("✔️  依赖安装完毕");
    } else {
      console.log("❌   依赖安装失败");
    }
  });
}
