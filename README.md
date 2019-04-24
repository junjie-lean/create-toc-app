# create-toc-app 
<br />

Create-toc-app is the global command for create a toc app;  
More about toc.js, see [here](https://github.com/junjie-lean/toc/tree/alpha).  

Create-toc-app是一个创建toc项目的命令行工具，跟多关于toc.js 可以查看[这里](https://github.com/junjie-lean/toc/tree/alpha).

[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)


## Installation

Using npm:
```npm
    npm install -g npm
    npm install -g create-toc-app
```

## Create Project

In Terminal or CMD:  

`create-toc-app <project Name> -s`,

### Attention 

In this version, toc.js adds a static version without a Node.js services. It called 'toc.serverless';  
So you can use add option '-s' to initial a serverless version;  

在当前版本，toc.js添加了一个不依赖Node.js服务的静态文件版本，我们称之为toc.serverless。可以在安装的时候增加 “-s” 参数来安装这个版本：

`
    create-toc-app -s <project name>
`

toc.serverless can create a simple React directory structure,And contains 'Ant desgin' and 'Lodash'.It even encapsulates 'Axios' as the request methods;All of this are configured.

toc.serverless能创建一个简单的React目录结构，并且它已经整合了“ant design"，“Lodash”等等，
并且还封装了“Axios"，支持多后端请求，这些都已经被配置好了，开箱即用；

if you execute the command without "-s", you will get a directory structure include a Node.js services, It's a Server-Side-Rander framework  packaging of Next.js. Now it's immature;I am not recommended for use it.And it also has some unfinished component ,I'm trying to  finish a demo version of it, but i've been very busy（lazy）lately.

如果执行的时候不加参数“-s”,你将得到一个包含node服务的目录结构，它是封装了Next.js的一个服务端渲染框架。目前它是不成熟的一个框架，我不太建议使用它，它还有部分未完成的功能。我正在尝试封装出一个demo版本出来，但是最近太忙（懒）了；


## Staring Project

Create-toc-app can install the dependencies by itself, you just need you network is working，it's necessary.  
And then run `npm run dev` to start the dev server；

Create-toc-app可以安装项目依赖包，我们只需要网络畅通即可，安装完毕后，然后执行`npm run dev`即可开始项目； 


## Found Some Bugs?

Help me to fixes bug:[issues](https://github.com/junjie-lean/create-toc-app/issues);


<!-- ## Warning  -->

