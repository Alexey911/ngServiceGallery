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
        'src/shared/*.js',
        'src/shared/configs/*.js',
        'src/shared/services/*.js',
        'src/shared/components/*.js',
        'src/modules/crud/ngServiceGallery.crud.module.js',
        'src/modules/monitoring/ngServiceGallery.monitoring.module.js',
        'src/modules/**/*.js'
    ],
    styles: [
        'src/assets/css/**/*.css'
    ],
    templates: {
        crud: ['src/modules/crud/*.html'],
        common: ['src/shared/**/*.html'],
        monitoring: ['src/modules/monitoring/*.html']
    },
    translations: [
        'src/shared/i18n/*.json'
    ]
};

let srcDest = 'dist';

gulp.task('clean', function () {
    return del([srcDest]);
});

//TODO
function concatAllSources() {
    return merge(
        gulp.src(paths.scripts),

        gulp.src(paths.translations)
            .pipe(translate({
                module: 'ngServiceGallery.common',
                standalone: false
            })),

        gulp.src(paths.templates.common)
            .pipe(ngTemplates({
                module: 'ngServiceGallery.common',
                standalone: false
            })),

        gulp.src(paths.templates.crud)
            .pipe(ngTemplates({
                module: 'ngServiceGallery.crud',
                standalone: false
            })),

        gulp.src(paths.templates.monitoring)
            .pipe(ngTemplates({
                module: 'ngServiceGallery.monitoring',
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
        paths.translations,
        paths.templates.crud,
        paths.templates.common,
        paths.templates.monitoring
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
