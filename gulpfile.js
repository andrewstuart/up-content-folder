var gulp = require('gulp');
var plug = require('gulp-load-plugins')();

var app = require('./bower.json');

gulp.task('build', function() {
    'use strict';
    return gulp.src('src/{app.js,**/*.js}')
        .pipe(plug.ngAnnotate())
        .pipe(plug.concat(app.name + '.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(plug.uglify())
        .pipe(plug.rename(app.name + '.min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['build']);
