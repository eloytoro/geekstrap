var gulp            = require('gulp');
var sass            = require('gulp-sass');
var inject          = require("gulp-inject");
var mainBowerFiles  = require('main-bower-files')();
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
    demo: {
        style: 'demo/sass/**/*.scss'
    },
    style: 'src/**/*.scss',
    js: 'src/**/*.js',
    template: 'src/**/*.html',
    dist: 'dist/**/*',
    bower: {
        js: mainBowerFiles.filter(function (val) {
            var suffix = val.split('.').pop();
            return suffix === 'js';
        }),
        sass: mainBowerFiles.filter(function (val) {
            var suffix = val.split('.').pop();
            return suffix === 'scss' || suffix === 'sass';
        })
    }
};

var beep = console.log.bind(console, '\007');

gulp.task('connect', function () {
    connect.server({
        root: './',
        port: 8000,
        livereload: true
    });
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
        gulp.start('compile-js');
    else
        beep();
    //cb continues the stream
    cb(null, file);
})));

gulp.task('compile-js', function () {
    var templates = gulp.src(globs.template)
    .pipe(templateCache('templates.js', { module: 'fg.geekstrap.templates', standalone: true }));
    var src = merge(templates, gulp.src(globs.js).pipe(angularFilesort()))
    .pipe(concat('geekstrap.min.js'));
    return merge(templates, src)
    .pipe(concat('geekstrap.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('compile-scss', function () {
    return gulp.src('src/geekstrap/_geekstrap.scss')
    .pipe(gulp.dest('dist/scss'));
});

gulp.task('compile-demo-scss', function () {
    return gulp.src(globs.demo.style)
    .pipe(sass({
        onError: function (err) {
            console.log(err);
            beep();
        }
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('demo/css'));
});

gulp.task('compile-demo-js', function () {
    return gulp.src(globs.bower.js)
    .pipe(concat('bower.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('demo/js'))
});

gulp.task('compile-demo', ['compile-demo-scss', 'compile-demo-js']);

gulp.task('ngdocs', ['compile-js', 'compile-demo'], function () {
    var options = {
        scripts: ['dist/js/geekstrap.min.js', 'demo/js/demo-controller.js'],
        html5Mode: false,
        styles: ['demo/css/demo.min.css'],
        title: 'Geekstrap'
    };
    return gulp.src(globs.js)
    .pipe(ngdocs.process(options))
    .pipe(gulp.dest('./docs'));
});

gulp.task('compile', ['compile-js', 'compile-scss', 'compile-demo']);

gulp.task('watch', ['compile', 'js-parser']);

gulp.task('default', ['connect', 'watch']);
