#!/usr/bin/env node

/*
 * @Author: junjie.lean
 * @Date: 2019-04-19 10:16:17
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2019-08-28 16:37:15
 */

/**
 * @description CTA v2 版本，增加对serverless的支持；
 */

const path = require("path");
const fs = require("fs");
const spawn = require("cross-spawn");
const program = require("commander");
const download = require("download-git-repo");
const ora = require("ora");

/**
 * @description git模板地址配置
 */
const GIT_OPTION = {
  pro: {
    branch: "master",
    addr: "junjie-lean/jfweb"
  },
  dev: {
    branch: "alpha",
    addr: "junjie-lean/jfweb"
  }
};

//调用开始时间计时
let timerStart = new Date().getTime();

//测试命令
let command = "npm";

//终端回显实例对象
let Ora = new ora({
  color: "green",
  spinner: {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
  },
});
Ora.start();
console.loading = txt => {
  Ora.spinner = {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
  };
  Ora.text = txt;
};

console.toLogger = txt => {
  Ora.info(txt);
};
console.succeed = txt => {
  Ora.succeed(txt);
};
console.warning = txt => {
  Ora.warn(txt);
};
console.close = () => {
  Ora.stop();
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
      console.warning("'<" + dir + ">'是一个不合适的项目名称!");
      return false;
    }
    // console.start("开始创建项目：");
    if (program.force) {
      if (!checkRepeat(dir)) {
        console.info("文件名冲突，即将删除已存在项目'<" + dir + ">'...");
        deleteFolder(path.join(process.cwd(), dir));
        // console.info("已删除！");
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
      console.warning("当前目录下已有'<" + dir + ">'文件夹");
      return false;
    }
  });

program.parse(process.argv);

/**
 * @description 判断dirname是否合法
 * @param {String} dirname
 */
function isAllowCreate(dirname) {
  let reg = /^[^\\/:\*\?""<>|]{1,120}$/gi;
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
  console.loading("开始创建项目'<" + dirname + ">',请稍等...");
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
    console.loading("开始初始化dev项目目录结构(这可能需要花费一点时间)...");

    new Promise((resolve, reject) => {
      download(
        `${GIT_OPTION.dev.addr}#${GIT_OPTION.dev.branch}`,
        path.join(process.cwd(), dirname),
        err => {
          if (err) {
            console.warning("无法拉取远程模板，请检查网络！");
            reject();
          } else {
            resolve();
          }
        }
      );
    })
      .then(() => {
        //返回异步子进程对象,方便后续处理
        console.loading('项目已拉取，开始安装依赖')
        return insDepend(dirname, serverless);
      })
      .then(cp => {
        //insdep Child_process
        // cp.on("close",()=>{
        //     return
        // })
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    console.toLogger("开始初始化目录结构(这可能需要花费一点时间)...");
    new Promise((resolve, reject) => {
      download(
        `${GIT_OPTION.pro.addr}#${GIT_OPTION.pro.branch}`,
        path.join(process.cwd(), dirname),
        err => {
          if (err) {
            console.warning("无法拉取远程模板，请检查网络！");
            reject();
          } else {
            // insDepend(dirname);
            resolve();
          }
        }
      );
    })
      .then(() => {
        console.loading('项目已拉取，开始安装依赖')
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
 * @return 子进程实例对象
 */
function insDepend(dirname, isServerless) {
  console.loading("项目目录初始化完毕，开始安装依赖...");
  let insDep = spawn(command, ["i"], {
    cwd: path.join(process.cwd(), dirname),
    encoding: "utf8",
    shell: process.platform == "win32",
    stdio: ["inherit", "ignore", "pipe"]
    // stdio: "inherit"
  });

  insDep.on("close", (code, signal) => {
    if (code == 0 && !signal) {
      console.toLogger("依赖安装完毕，正在做就绪准备...");
      showIntro(dirname, isServerless);
    } else {
      console.warning("依赖安装失败，请检查网络！");
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
function showIntro(dirname, isServerless) {
  console.succeed(
    `新建项目'${dirname}${
      isServerless ? " - 无服务版" : " - 接口转发版"
    }' 创建完毕`
  );
  timeCount(dirname, isServerless);
}

/**
 * @description 安装时间计数
 */
function timeCount() {
  let elapsed = new Date().getTime() - timerStart;
  console.toLogger(elapsed);
  console.close();
}
