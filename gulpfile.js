var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var ejs = require('gulp-ejs')
var log = require('fancy-log')
var inject = require('gulp-inject');
var htmlbeautify = require('gulp-html-beautify');


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {
    browserSync.init({
        server: "./app"
    });
    //checking for any new asset change
    gulp.watch("assets/scss/*.scss", ['compile']).on('change',browserSync.reload);
    gulp.watch("assets/css/*.css",['compile']).on('change',browserSync.reload);
    gulp.watch("assets/js/*.js",['compile']).on('change',browserSync.reload);
    gulp.watch("templates/*.ejs", ['compile']).on('change',browserSync.reload);
    gulp.watch("templates/**/*.ejs", ['compile']).on('change',browserSync.reload);
    gulp.watch("templates/**/**/*.ejs", ['compile']).on('change',browserSync.reload);
    gulp.watch("app/html/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS 
gulp.task('sass', function () {
    return gulp.src("assets/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

//this compiles ejs to html
gulp.task('ejs-compile', function () {
    gulp.src('./templates/*.ejs')
        .pipe(ejs({
            msg: 'Hello Gulp!'
        }, {}, {
            ext: '.html'
            }).on('error', function (err) {
                gulp.watch("templates/*.ejs", ['compile']);
                gulp.watch("templates/**/*.ejs", ['compile']);                    
        }))
        .pipe(gulp.dest('./app'));
});

//this copies all resources to app folder
gulp.task('copy', function () {
    gulp.src('assets/css/*.css').pipe(gulp.dest('app/css'));
    return gulp.src('assets/js/*.js').pipe(gulp.dest('app/js'));    
})

//this beatifies html code
gulp.task('htmlbeautify', function() {
    gulp.src('./app/*.html')
      .pipe(htmlbeautify())
      .pipe(gulp.dest('./app/'))
 });

//this tasks compile all necesary files and creates a dump in app/ folder
gulp.task('compile', ['ejs-compile', 'htmlbeautify', 'sass', 'copy']);

//this happens when you run gulp
gulp.task('default', ['compile', 'serve']);