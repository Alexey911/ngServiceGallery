'use strict';

let del = require('del'),
    gulp = require('gulp'),
    merge = require('merge2'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    replace = require('gulp-replace'),
    concatCss = require('gulp-concat-css'),
    translate = require('gulp-angular-translate'),
    ngTemplates = require('gulp-ng-templates');


let paths = {
    scripts: [
        'src/*.js',
        'src/configs/**/*.js',
        'src/services/**/*.*',
        'src/components/**/*.js',
        'src/modals/*.js'
    ],
    styles: [
        'src/assets/css/**/*.css'
    ],
    templates: [
        'src/components/*.html',
        'src/modals/*.html'
    ],
    translations: [
        'src/i18n/*.json'
    ]
};

let srcDest = 'dist';

gulp.task('clean', function () {
    return del([srcDest]);
});

function concatAllSources() {
    return merge(
        gulp.src(paths.scripts),

        gulp.src(paths.translations)
            .pipe(translate({
                module: 'ngServiceGallery',
                standalone: false
            })),

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

function concatArrays(/*arrays*/) {
    let result = [];

    for (let i in arguments) {
        result = result.concat(arguments[i]);
    }
    return result;
}

gulp.task('watch', function () {
    let sources = concatArrays(
        paths.styles,
        paths.scripts,
        paths.templates,
        paths.translations
    );

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
