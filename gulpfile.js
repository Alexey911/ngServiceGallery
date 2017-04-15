'use strict';

let del = require('del'),
    gulp = require('gulp'),
    merge2 = require('merge2'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    replace = require('gulp-replace'),
    ngTemplates = require('gulp-ng-templates');

'use strict';

let paths = {
    scripts: [
        'src/app.js',
        'src/configs/**/*.js',
        'src/services/**/*.*',
        'src/components/**/*.js'
    ],
    templates: [
        'src/components/*.html'
    ]
};

let srcDest = 'dist';

gulp.task('clean', function () {
    return del([srcDest]);
});

gulp.task('build', ['clean'], function () {
    merge2(
        gulp.src(paths.scripts),
        gulp.src(paths.templates)
            .pipe(ngTemplates({
                module: 'ngServiceGallery',
                standalone: false
            }))
    )
        .pipe(concat('ngServiceGallery.js'))
        .pipe(gulp.dest(srcDest));

});

gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['build']);
});

gulp.task('minify', function () {
    merge2(
        gulp.src(paths.scripts),
        gulp.src(paths.templates)
            .pipe(ngTemplates({
                module: 'ngServiceGallery',
                standalone: false
            }))
    )
        .pipe(concat('ngServiceGallery.min.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(srcDest));
});

gulp.task('default', function () {
    gulp.start('build', 'minify');
});
