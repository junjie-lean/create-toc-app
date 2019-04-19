#!/usr/bin/env node

/*
 * @Author: junjie.lean
 * @Date: 2019-04-19 10:16:17
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2019-04-19 22:09:35
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

/**
 * @description 主程
 */
program.version(require("./package.json").version, "-v,--version");
program
  .option("-s --serverless", "ues toc have NOT server")
  .option(
    "-f --force",
    "force to create project(it will delete if have a same dir!)"
  )
  .action(dir => {
    //判断dirname是否合法
    if (!isAllowCreate(dir)) {
      // throw new Error("not all");
      console.log("❌  '<" + dir + ">'是一个不合适的项目名称");
      return false;
    }

    if (program.force) {
      if (!checkRepeat(dir)) {
        console.log("⚠️  即将删除项目<" + dir + ">");
        deleteFolder(path.join(process.cwd(), dir));
      }

      createFloder(dir);
      getTemplate(dir, program.serverless);

      return false;
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
  let reg = /(^\w{1,64}$)/gi;
  if (!reg.test(dirname)) {
    return false;
  }

  return true;
}

/**
 * @description 创建文件目录
 * @param {String} dirname
 */
function createFloder(dirname) {
  console.log("✔️  开始创建项目“<" + dirname + ">”,请稍等...");
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
    console.log(
      "✔️  开始初始化toc.serverless目录结构(这可能需要花费一点时间)..."
    );

    new Promise((resolve, reject) => {
      download(
        `${GIT_OPTION.serverless.addr}#${GIT_OPTION.serverless.branch}`,
        path.join(process.cwd(), dirname),
        err => {
          if (err) {
            console.log("❌  无法拉取模板");
            reject();
          } else {
            resolve();
          }
        }
      );
    })
      .then(() => {
        //返回异步子进程对象,方便后续处理
        return insDepend(dirname);
      })
      .then(cp => {
        //insdep Child_process
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    console.log("✔️  开始初始化toc目录结构(这可能需要花费一点时间)...");
    new Promise((resolve, reject) => {
      download(
        `${GIT_OPTION.server.addr}#${GIT_OPTION.server.branch}`,
        path.join(process.cwd(), dirname),
        err => {
          if (err) {
            console.log("❌  无法拉取模板");
            reject();
          } else {
            // insDepend(dirname);
            resolve();
          }
        }
      );
    })
      .then(() => {
        return insDepend(dirname);
      })
      .then(cp => {
        //insdep Child_process
      })
      .catch(err => {
        console.log(err);
      });
  }
}

/**
 * @description 安装依赖的
 */
function insDepend(dirname) {
  console.log("✔️  项目目录初始化完毕，开始安装依赖...");
  let insDep = spawn("npm", ["i"], {
    cwd: path.join(process.cwd(), dirname),
    encoding: "utf8",
    shell: process.platform == "win32",
    stdio: ["inherit", "ignore", "pipe"]
    //   stdio: "inherit"
  });
  insDep.on("close", (code, signal) => {
    if (code == 0 && !signal) {
      console.log("✔️  依赖安装完毕");
    } else {
      console.log("❌   依赖安装失败");
    }
  });
  return insDep;
}

/**
 *
 * @description 删除指定文件或文件夹
 */
function deleteFolder(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(file => {
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

/**
 * @description print项目初始化介绍
 */
function showIntro() {
  console.log();
}
