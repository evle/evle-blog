---
title: "Gulp for Beginners"
date: "2018-03-18"
layout: post
draft: false
path: "/posts/Gulp-for-Beginners"
category: "Gulp"
tags:
  - Sass
  - Gulp
  - BrowserSync
description: ""
---

Gulp是一个前端项目的构建工具, 通常用来：
- 刷新浏览器当文件改动时
- 预处理 比如编译`.scss`文件为`.css`
- 压缩代码

## 安装
全局
`sudo npm install gulp -g`
局部
`$ npm install gulp --save-dev`

## 基本使用
1. 创建`gulpfile.js`, 并对任务进行配置.
```JavaScript
const gulp = require('gulp');
gulp.task('task-name', () => {
    // Stuff here
});
```
2. 运行gulp task
`gulp task-name`

在真实的使用中，gulp task通常比较复杂比如以下这个这个例子
```JavaScript
gulp.task('task-name', () => {
  return gulp.src('source-files')  
    .pipe(aGulpPlugin())          
    .pipe(gulp.dest('destination'))
})
```
`gulp.src` 指定了执行哪些文件
`.pipe` 表示传递执行结果给插件
`gulp.dest` 指定了输出文件的位置

## 预处理Sass文件
编译sass文件我们需要`gulp-sass`插件
```bash
$ npm install gulp -sass --save-dev
```
接下来编写gulp task(gulpfile.js)
```JavaScript
const gulp = require('gulp');
const sass= require('gulp-sass')

gulp.task('sass', () => {
  return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
})
```
上面代码将`app/scss/`文件下的所有scss文件编译成了css文件并输出到`app/css`文件夹. 为了实现当scss文件改动时自动编译我们还需要使用`watch`方法.
```JavaScript
gulp.task('watch', () => {
  gulp.watch('app/scss/**/*.scss', ['sass']);

})
```
上面代码执行了一个watch task, 当`.scss`文件有改动时, 调用我们之前定义好的`sass` task.

## 刷新浏览器当代码改动后
为了方便开发，当`.scss`文件改动时，我们需要页面自动刷新浏览器看下改动的效果. 所以我们还需要添加**Browser Sync**插件.
```bash
$ npm install browser-sync --save-dev
```
导入browser sync插件并配置
```javascript
gulp.task('browserSync', () => {
  browserSync.init({
    server:{
      baseDir: 'app' // 运行服务器的目录
    }
  })
})
```
此外还需要修改我们之前定义好的sass task中, 让它在处理完sass文件后调用browser sync插件重新加载页面.
```JavaScript
gulp.task('sass',  () => {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
})
```
除了监控sass文件外，我们还要监控html以及js文件如下:
```javascript
gulp.task('watch', () => {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});
```
现在我们来设置下任务的执行顺序
```bash
$ npm install run-sequence --save-dev
```
```JavaScript
gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync'], 'watch',
    callback
  )
})
```
我们用`run-sequence`为我们的任务规定了执行的顺序，先运行sass，然后运行browserSymc，最后运行watch task. `default`意味着当我们在终端只需要执行`gulp`就可以运行上面定义的任务序列.

## 压缩CSS和JSS文件
前面介绍了gulp在开发时的使用场景，下面我们介绍在发布时，如何使用gulp优化我们的网页. 通常在压缩代码之前先要使用`useref`将代码合并到一个文件里面，比如：
```javascript
<body>
  <!-- other stuff -->
  <!--build:js js/main.min.js -->
  <script src="js/lib/a-library.js"></script>
  <script src="js/lib/another-library.js"></script>
  <script src="js/main.js"></script>
  <!-- endbuild -->
</body>
```
上面的`<!--build:js js/main.min.js -->`是useref的语法，将build包裹的文件编译成一个文件(main.min.js). 接下来我们安装useref并编写useref task.
```bash
$ npm install gulp-useref --save-dev
```
```javascript
gulp.task('useref', () => {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
})
```
合并成一个文件之后我们需要使用`gulp-uglify`压缩文件
```bash
$ npm install gulp-uglify --save-dev
```
```JavaScript
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});
```
`.js`文件优化完之后，我们还需要`gulp-cssnano`优化`.css`文件
```html
<!--build:css css/styles.min.css-->
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/another-stylesheet.css">
<!--endbuild-->
```
```bash
$ npm install gulp-cssnano
```
```JavaScript
var cssnano = require('gulp-cssnano');

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});
```

## 优化图片
```bash
$ npm install gulp-imagemin --save-dev
```
```JavaScript
var imagemin = require('gulp-imagemin');
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin({
    interlaced: true
  }))
  .pipe(gulp.dest('dist/images'))
});
```
优化图片是个费时的操作，每当我们运行`gulp images`时，它会优化所有的图片。我们希望它不重复优化已经优化过的图片，所以我们需要安装`gulp-cache`插件.
```bash
$ npm install gulp-cache --save-dev
```
```JavaScript
var cache = require('gulp-cache');
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});
```
## 复制文件
因为字体文件没有必要优化，因此在生产版本时，我们要将字体文件复制到dist目录
```javascript
gulp.task('fonts', () => {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})
```

## 删除文件
最后一步，我们还要自动清理生成到dist的文件
```bash
$ npm install del --save-dev
```
```JavaScript
const del = require('del');
gulp.task('clean:dist', () => {
  return del.sync('dist');
})
```

## 合并任务
为了构建生产版本我们前面定义了一系列任务，接下来我们需要合并这些任务. 实现一条命令构建生产版本.
```JavaScript
const runSequence = require('run-sequence')
gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})
```

[点击查看完整代码](https://github.com/zellwk/gulp-starter-csstricks)
