var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var html2js = require('gulp-html2js');


var jsFiles = [
    "app/some/util.js",
    "app/app.module.js",
    "app/app.config.js",
    "app/services/**/*.*",
    "app/configs/**/*.js",
    "app/components/**/*.js"
];

var jsDest = 'dist';

gulp.task('build', function () {
    gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest));
        // .pipe(rename('scripts.min.js'))
        // .pipe(uglify())
        // .pipe(gulp.dest(jsDest));

    // gulp.src(['app/components/**/*.html', 'app/crud.json'])
    //     .pipe(gulp.dest(jsDest));

    // gulp.src([jsDest + '/scripts.js'])
    //     .pipe(replace('undefined', new Date()))
    //     .pipe(gulp.dest(jsDest + '/scripts.js'));

    gulp.src('app/components/*.html')
        .pipe(html2js('templates.js', {
            adapter: 'angular',
            name: 'app'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function (){
    var files = jsFiles.slice();
    files.push('app/components/**/*.html');
    gulp.watch(files, ['build']);
});