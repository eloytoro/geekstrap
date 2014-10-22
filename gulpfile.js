var gulp            = require('gulp');
var sass            = require('gulp-sass');
var inject          = require("gulp-inject");
var mainBowerFiles  = require('main-bower-files');
var rename          = require('gulp-rename');
var minifycss       = require('gulp-minify-css');
var angularFilesort = require('gulp-angular-filesort');
var connect         = require('gulp-connect');
var watch           = require('gulp-watch');
var filter          = require('gulp-filter');
var plumber         = require('gulp-plumber');
var jshint          = require('gulp-jshint');
var stylish         = require('jshint-stylish');
var map             = require('map-stream');
var ngdocs          = require('gulp-ngdocs');
var uglify          = require('gulp-uglify');
var concat          = require('gulp-concat');
var templateCache   = require('gulp-angular-templatecache');
var merge           = require('merge-stream');

var globs = {
    style: ['sass/**/*.scss', 'src/**/*.scss', 'css/**/*.css'],
    js: 'src/**/*.js',
    template: 'src/**/*.html',
    dist: 'dist/**/*',
    bower: mainBowerFiles()
};

var beep = console.log.bind(console, '\007');

gulp.task('inject', function () {
    return gulp.src('./index.html')
    .pipe(inject(gulp.src(globs.bower), {relative: true, name: 'bower'}))
    .pipe(inject(gulp.src(globs.js).pipe(plumber()).pipe(angularFilesort()), {relative: true}))
    .pipe(gulp.dest('./'))
    .on('end', function () {
        gulp.start('reload');
    });
});

gulp.task('connect', function () {
    connect.server({
        root: './',
        port: 8000,
        livereload: true
    });
});

gulp.task('reload', ['compile-css', 'compile-js'], function () {
    gulp.src('./index.html')
    .pipe(connect.reload());
});

gulp.task('sass-parser', function () {
    return watch(globs.style, {name: 'Sass-Parser'}, function (files, cb) {
        gulp.start('reload');
    })
});

//failsafe reporter defined within closure scope
gulp.task('js-parser', (function (reporter) {
    return function () {
        return watch(globs.js, {name: 'JS-Parser'})
        .pipe(plumber())
        .pipe(jshint())
        .pipe(reporter)
        .pipe(jshint.reporter(stylish));
    };
})(map(function (file, cb) {
    if (file.jshint.success)
        gulp.start('build');
    else
        beep();
    //cb continues the stream
    cb(null, file);
})));

gulp.task('file-watcher', function () {
    return watch(globs.template, {name: 'File-Watcher'}, function (files, cb) {
        return gulp.start('reload');
    });
});

gulp.task('compile-css', function () {
    return gulp.src(globs.style)
    .pipe(sass({
        onError: function (err) {
            console.log(err);
            beep();
        }
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(gulp.dest('docs/css'));
});

gulp.task('compile-js', function () {
    var templates = gulp.src(globs.template)
    .pipe(templateCache('templates.js', { module: 'fg.geekstrap.templates', standalone: true }));
    return merge(templates, gulp.src(globs.js).pipe(angularFilesort()))
    .pipe(concat('geekstrap.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(gulp.dest('docs/js'));
});

gulp.task('ngdocs', ['compile-js', 'compile-css'], function () {
    var options = {
        scripts: ['geekstrap.min.js'],
        html5Mode: false,
        styles: ['css/demo.min.css']
    };
    return gulp.src(globs.js)
    .pipe(ngdocs.process(options))
    .pipe(gulp.dest('./docs'));
});

gulp.task('build', ['compile-js', 'compile-css'], function () {
    gulp.src('./index.html')
    .pipe(inject(gulp.src(globs.bower), {relative: true, name: 'bower'}))
    .pipe(inject(gulp.src(globs.dist), {relative: true}))
    .pipe(plumber())
    .pipe(gulp.dest('./'))
});

gulp.task('watch', ['build', 'sass-parser', 'js-parser']);

gulp.task('default', ['connect', 'watch']);
