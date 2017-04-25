var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var connect = require('gulp-connect');
var replace = require('gulp-html-replace');
var includer = require('gulp-htmlincluder');
var livereload = require('gulp-livereload');
var spritecreator = require('gulp.spritesmith');
const opn = require('opn');
var cleanCSS = require('gulp-clean-css');

gulp.task('sprite', function(){
	var spriteData = gulp.src('dev/img/icons/*.png')
						.pipe(spritecreator({
							imgName: 'sprite.png',
							cssName: 'sprite.css',
							algorithm: 'binary-tree',
                            
						}));
	spriteData.img.pipe(gulp.dest('build/img/'));
	spriteData.css.pipe(gulp.dest('build/css/'));
});

gulp.task('server', function(){
	connect.server({
		root : 'build',
		livereload: true,
        port: 8888
	});
    opn('http://localhost:8888/', {app: 'chrome'});
});
gulp.task('css', function(){
	gulp.src('dev/css/**/*.css')
		.pipe(concatCss('style.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('build/css/'))
		.pipe(connect.reload());
});

gulp.task('html', function(){
	gulp.src('dev/**/*.html')
		.pipe(includer())
		.pipe(replace({
			css: 'css/style.css'
		}))
		.pipe(gulp.dest('build/'))
		.pipe(connect.reload());
});

gulp.task('default', function(){
	gulp.start('css', 'html', 'server');

	gulp.watch(['dev/css/**/*.css'], function(){
		gulp.start('css');
	});
	gulp.watch(['dev/**/*.html'], function(){
		gulp.start('html');
	});
});




//gulp.task('default', function(){
//    gulp.start('css', 'html', 'server');
//
//    gulp.watch(['dev/css/**/*.css'], function(){
//        gulp.start('css');
//    });
//    gulp.watch(['dev/**/*.html'], function(){
//        gulp.start('html');
//    });
//});