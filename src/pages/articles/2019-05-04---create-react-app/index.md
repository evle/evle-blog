---
title: '搭建React脚手架 create-react-app原理分析'
date: '2019-05-04'
layout: post
draft: false
path: '/posts/create-react-app'
category: 'React'
tags:
  - React
  - JavaScript
description: ''
---

构建 React 应用的第一步是搭建 React 开发环境,  开发环境是项目的基石也是比较复杂繁琐的一个部分, 因此搭建一个脚手架工具来完成自动化的流程是必不可少的。Facebook 官方提供了一个有效且功能齐全的 React 应用脚手架工具`create-react-app`, 本文通过分析`create-react-app`的源码来了解如何编写一个脚手架工具来提高开发效能。

React 脚手架工具分为 2 个部分:

- create-react-app
- react-scripts

`create-react-app`：在项目下生成了 package.json 并安装 React 应用所需要的依赖文件, 最后将 react 的模版代码拷贝到项目中。`react-scripts`：配置 Webpack 来构建 react 应用, 比如语法转换、devServer 等等。下面让我们根据源码来详细的分析下它们到底是如何运作的。

## create-react-app

1. 检查 Node 版本号, 如果小于 4 则无法使用该工具

```javascript
let major = process.versions.node.split('.')[0]
if (major < 4) {
  process.exit(1)
}
// 检查版本后 开始 creat-react-app 处理流程
require('./createReactApp')
```

2. 生成`package.json` 并检查 yarn 或者 npm 是否安装了

```javascript
// 检查App name 使用validate-npm-package-name
checkAppName(appName)

// 检查有没有安装yarn
shouldUseYarn() // return execSync('yarnpkg --version', { stdio: 'ignore' }) ? true : false

// 检查npm
checkThatNpmCanReadCwd()

const packageJson = {
  name: appName,
  version: '0.1.0',
  private: true,
}
fs.writeFileSync(
  path.join(root, 'package.json'),
  JSON.stringify(packageJson, null, 2)
)
```

3. 安装 React 应用所需要的依赖 `react`, `react-dom`, `react-scripts`

```javascript
return new Promise((resolve, reject) => {
  command = 'yarn' || 'npm'
  args = [...installArgs, ...dependencies]
  const child = spawn(command, args, { stdio: 'inherit' })
  child.on('close', code => {
    if (code !== 0) {
      reject({
        command: `${command} ${args.join(' ')}`,
      })
      return
    }
    resolve()
  })
})
```

## react-scripts

首先在安装依赖之后, `create-react-app`会调用`react-scripts/init.js`文件用来复制模版文件到项目中, 以及在`package.json`中添加脚手架工具命令。

```javascript
// 添加脚手架命令
appPackage.scripts = {
  start: 'react-scripts start',
  build: 'react-scripts build',
  test: 'react-scripts test --env=jsdom',
  eject: 'react-scripts eject',
}

fs.writeFileSync(
  path.join(appPath, 'package.json'),
  JSON.stringify(appPackage, null, 2)
)

// 复制模版文件到项目中
// 拷贝 react-scripts/template中的public和src中的文件
fs.copySync(templatePath, appPath)
```

上面在`scripts`中添加的命令中`start`命令是构建 React 应用的核心也就是配置 Webpack。

```javascript
// 引入webpack和dev-server
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

// 通过创建一个compiler的方式来加载Webpack的配置
const compiler = createCompiler(webpack, config, appName, urls, useYarn)
const devServer = new WebpackDevServer(compiler, serverConfig)

// 启动 WebpackDevServer.
devServer
  .listen(port, HOST, err => {
    if (err) {
      return console.log(err)
    }
    if (isInteractive) {
      clearConsole()
    }
    console.log(chalk.cyan('Starting the development server...\n'))
    openBrowser(urls.localUrlForBrowser)
  })

  [('SIGINT', 'SIGTERM')].forEach(function(sig) {
    process.on(sig, function() {
      // 当检测到ctrl+c中断程序时 关闭devServer
      devServer.close()
      process.exit()
    })
  })
```

从上面`start`的主流程中我们可以看出`createCompiler`和`new WebpackDevServer(compiler, serverConfig)`是配置 Webpack 的关键代码 , 下面我们详细分析一下这个两个函数

### createCompiler

`createCompiler`其实只是对 webpack 提供的`webpack`接口的一个封装, 它让我们可以更加细腻的控制整个 webpack 构建流程。

```javascript
function createCompiler(webpack, config, appName, urls, useYarn) {
  let compiler = webpack(config, handleCompile)

  // 给invalid事件注册一个回调, 给开发者提示正在编译
  compiler.plugin('invalid', () => {
    console.log('Compiling...')
  })

  // 给done事件注册一个回调, 给开发者提示编译完成
  compiler.plugin('done', stats => {
    // 让webpack提示消息更友好, 分开错误消息和警告消息, 并且直接显示错误消息
    const messages = formatWebpackMessages(stats.toJson({}, true));

    // 提示错误信息策略
    // 有错误存在时: 只提示语法错误, 开发人员可以直观看到语法错误屏蔽无关信息
    // 没有错误存在: 提示警告, 并可以给开发人员一些提示和帮助信息
    if (messages.errors.length) {
        console.log(chalk.red('Failed to compile.\n'));
        console.log(messages.errors.join('\n\n'));
        return;
    }
     if (messages.warnings.length) {
      console.log(messages.warnings.join('\n\n'));
      console.log(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.'
      );
     }
  })
}
```

下面让我们看下上面代码中`config`配置文件, 看它是如何配置 Webpack 的。

```javascript
const config = require('../config/webpack.config.dev')

// webpack.config.dev.js
module.exports = {
  entry: [
    // 代替webpack-dev-server提供更好的开发体验
    require.resolve('react-dev-utils/webpackHotDevClient'),
    // 入口文件
    paths.appIndexJs,
  ],
  output: {
    filename: 'static/js/bundle.js', // 输出文件名
    chunkFilename: 'static/js/[name].chunk.js', // code splitting
  },
  module: {
    // 配置linter规范代码
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
              // @remove-on-eject-begin
              baseConfig: {
                extends: [require.resolve('eslint-config-react-app')],
              },
              ignore: false,
              useEslintrc: false,
              // @remove-on-eject-end
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      // 编译JS
      {
         test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              // @remove-on-eject-begin
              babelrc: false,
              presets: [require.resolve('babel-preset-react-app')],
              cacheDirectory: true,
            },
      },
      // 编译CSS
      {
          test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
            ],
      },
      // 处理文件
      {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
      }
  },

  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    new HtmlWebpackPlugin({})
    new webpack.DefinePlugin(env.stringified),
    new webpack.HotModuleReplacementPlugin(),
    // 自动运行npm install安装依赖
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ]
}
```

最后让我们了解一下在`yarn build`命令是如何配置生产模式下的 Webpack 配置文件, 除了相同的部分外, 生产模式的配置文件额外做了一些  代码的压缩之类的操作, 通常建立 3 个配置文件更易于维护, 一个用于开发, 一个用于生产, 另一个放一些两个模式的通用部分。

```javascript
// 压缩HTML模版
new HtmlWebpackPlugin({
  inject: true,
  template: paths.appHtml,
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  },
}),
  // 压缩JS代码
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      comparisons: false,
    },
    mangle: {
      safari10: true,
    },
    output: {
      comments: false,
      ascii_only: true,
    },
    sourceMap: shouldUseSourceMap,
  }),
  // 抽离CSS文件
  new ExtractTextPlugin({
    filename: cssFilename,
  }),
  // 生成资源映射表, 使找资源无需解析index.html
  new ManifestPlugin({
    fileName: 'asset-manifest.json',
  }),
  // 使用service worker缓存数据
  new SWPrecacheWebpackPlugin({
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    filename: 'service-worker.js',
    logger(message) {
      if (message.indexOf('Total precache size is') === 0) {
        return
      }
      if (message.indexOf('Skipping static resource') === 0) {
        return
      }
      console.log(message)
    },
    minify: true,
    // For unknown URLs, fallback to the index page
    navigateFallback: publicUrl + '/index.html',
    // Ignores URLs starting from /__ (useful for Firebase):
    navigateFallbackWhitelist: [/^(?!\/__).*/],
    // Don't precache sourcemaps (they're large) and build asset manifest:
    staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
  })
```

## 总结

分析了`create-create-app`工具源码之后, 我们了解了编写一个脚手架工具的基本流程: 检查当前环境是否可以运行项目, 生成 package.json 并安装相关依赖, 复制模版到项目中。此外我们还了解了如何使用 webpack 来构建 React 应用, 我们可以针对自己的项目需求来对`create-create-app`默认提供的 webpack 进行更改比如增加一个 sass loader , 当然我们也可以通过`eject`命令来自己配置 Webpack。
