'use strict';

let del = require('del'),
    gulp = require('gulp'),
    merge2 = require('merge2'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    replace = require('gulp-replace'),
    concatCss = require('gulp-concat-css'),
    ngTemplates = require('gulp-ng-templates');


let paths = {
    scripts: [
        'src/*.js',
        'src/configs/**/*.js',
        'src/services/**/*.*',
        'src/components/**/*.js'
    ],
    styles: [
        'src/assets/css/**/*.css'
    ],
    templates: [
        'src/components/*.html'
    ]
};

let srcDest = 'dist';

gulp.task('clean', function () {
    return del([srcDest]);
});

function concatAllSources() {
    return merge2(
        gulp.src(paths.scripts),
        gulp.src(paths.templates)
            .pipe(ngTemplates({
                module: 'ngServiceGallery',
                standalone: false
            }))
    ).pipe(concat('ngServiceGallery.js'))
}

gulp.task('build', ['clean'], function () {
    concatAllSources()
        .pipe(gulp.dest(srcDest));

    gulp.src(paths.styles)
        .pipe(concatCss("ngServiceGallery.css"))
        .pipe(gulp.dest(srcDest));
});

gulp.task('watch', function () {
    let sources = paths.scripts.concat(paths.templates);
    gulp.watch(sources, ['build']);
});

gulp.task('minify', function () {
    concatAllSources()
        .pipe(gulp.dest(srcDest))
        .pipe(rename({suffix: '.min'}))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(srcDest));
});

gulp.task('default', function () {
    gulp.start('build', 'minify');
});
