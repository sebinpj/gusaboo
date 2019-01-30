var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var ejs = require('gulp-ejs')
var log = require('fancy-log')
var inject = require('gulp-inject');
var htmlbeautify = require('gulp-html-beautify');
var cache = require('gulp-cache')

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {
    browserSync.init({
        server: "./app"
    });
    //checking for any new asset change
    gulp.watch("assets/scss/*.scss", ['compile']).on('change', browserSync.reload);
    gulp.watch("assets/css/*.css", ['compile']).on('change', browserSync.reload);
    gulp.watch("assets/js/*.js", ['compile']).on('change', browserSync.reload);
    gulp.watch("assets/*.html", ['compile']);
    gulp.watch("templates/**/*.ejs", ['compile']);
    gulp.watch("templates/**/**/*.ejs", ['compile']);
    gulp.watch("templates/*.ejs", ['compile']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS 
gulp.task('sass', function () {
    return gulp.src("assets/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css", {
            overwrite: true
        }))
        .pipe(browserSync.stream());
});

//gulp-ejs seems buggy removing ejs 
// //this compiles ejs to html
gulp.task('ejs-compile', function () {
    gulp.src('./templates/*.ejs')
        .pipe(ejs({
            msg: 'Hello Gulp!'
        }, {}, {
            ext: '.html'
        }).on('error', log))
        .pipe(gulp.dest('./app', {
            overwrite: true
        }));
});

//this copies all resources to app folder
gulp.task('copy', function () {
    gulp.src('assets/css/*.css').pipe(gulp.dest('app/css', {
        overwrite: true
    }));
    return gulp.src('assets/js/*.js').pipe(gulp.dest('app/js', {
        overwrite: true
    }))
})



gulp.task('clearCache', function () {
    cache.clearAll();
});
//this tasks compile all necesary files and creates a dump in app/ folder
gulp.task('compile', ['clearCache','ejs-compile', 'copy','sass']);

//this happens when you run gulp
gulp.task('default', ['compile', 'serve']);