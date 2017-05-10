var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var connect = require('gulp-connect');
var replace = require('gulp-html-replace');
var includer = require('gulp-htmlincluder');
var livereload = require('gulp-livereload');
var spritecreator = require('gulp.spritesmith');
var opn = require('opn');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass'); //Подключаем Sass пакет
var rename = require("gulp-rename");
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var minify = require('gulp-babel-minify');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
//var browserSync =   require('browser-sync');

gulp.task('sprite', function () {
    var spriteData = gulp.src('dev/img/icons/*.png')
        .pipe(spritecreator({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            algorithm: 'binary-tree',
        }));
    spriteData.img.pipe(gulp.dest('build/img/'));
    spriteData.css.pipe(gulp.dest('build/css/'));
});


gulp.task('server', function () {
    connect.server({
        root: 'build',
        livereload: true,
        port: 8888
    });
    opn('http://localhost:8888/', {
        app: 'chrome'
    });
});

//gulp.task('browser-sync', function(){
//    browserSync({
//        server: {
//            baseDir: 'build'
//        },
//    });
//});

gulp.task('imagemin', function () {
    return gulp.src('dev/img/**/*')
        //        .pipe(cache(imagemin()))
        .pipe(imagemin())
        .pipe(gulp.dest('build/img'))
        .pipe(connect.reload());
});

gulp.task('image', function () {
    return gulp.src('dev/img/**/*')
        .pipe(gulp.dest('build/img'));
});

//gulp.task('fonts', function() {
//    return gulp.src('dev/fonts/**/*')
//        .pipe(gulp.dest('build/fonts')); 
//});

gulp.task('css', function () {
    gulp.src('dev/sass/style.scss')
        //		.pipe(concatCss('style.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/css/'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('dev/js/common.js')

        //        .pipe(babel({
        //            presets: ['es2015']
        //        }))
        //        .pipe(minify())
        .pipe(rename('common.min.js'))
        .pipe(gulp.dest('build/js/'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src('dev/**/*.html')
        .pipe(includer())
        .pipe(replace({
            css: 'css/style.min.css',
            js: 'js/common.min.js'
        }))
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload());
});

gulp.task('json', function () {
    gulp.src('dev/**/*.json')
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload());
});

gulp.task('lib', function () {
    gulp.src('dev/lib/**/*.*')
        .pipe(gulp.dest('build/lib/'))
        .pipe(connect.reload());
});



gulp.task('removedist', function () {
    return del.sync('build/**/*.*');
});

gulp.task('default', function () {
    gulp.start('css', 'json', 'lib', 'html', 'js', 'imagemin', 'server');

    gulp.watch(['dev/sass/*.*'], function () {
        gulp.start('css');
    });
    gulp.watch(['dev/**/*.html'], function () {
        gulp.start('html');
    });
    gulp.watch(['dev/js/*.js'], function () {
        gulp.start('js');
    });
    gulp.watch(['dev/img/**/*.*'], function () {
        gulp.start('image');
    });
    gulp.watch(['dev/**/*.json'], function () {
        gulp.start('json');
    });
    //    gulp.watch(['dev/fonts/**/*.*'], function(){
    //        gulp.start('fonts');
    //    });

    gulp.watch(['dev/lib/**/*.*'], function () {
        gulp.start('lib');
    });
});