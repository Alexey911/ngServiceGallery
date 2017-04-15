var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var html2js = require('gulp-html2js');

var jsFiles = [
    "src/app.js",
    "src/configs/**/*.js",
    "src/services/**/*.*",
    "src/components/**/*.js"
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

    gulp.src('src/components/*.html')
        .pipe(html2js('templates.js', {
            adapter: 'angular',
            name: 'app'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function (){
    var files = jsFiles.slice();
    files.push('src/components/**/*.html');
    gulp.watch(files, ['build']);
});