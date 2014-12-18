var gulp            = require('gulp');
var sass            = require('gulp-sass');
var wiredep         = require('wiredep').stream;
var mainBowerFiles  = require('main-bower-files')();
var rename          = require('gulp-rename');
var minifycss       = require('gulp-minify-css');
var angularFilesort = require('gulp-angular-filesort');
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
var gutil           = require('gulp-util');
var browserSync     = require('browser-sync');

var globs = {
    style: 'src/**/*.scss',
    js: 'src/**/*.js',
    template: 'src/**/*.html',
    dist: {
        js: 'src/geekstrap/**/*.js',
        templates: 'src/geekstrap/**/.html'
    }
};

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './',
            index: 'src/demo/index.html'
        }
    });
});

gulp.task('sass', function () {
    return gulp.src(globs.style)
        .pipe(sass({
            onError: function (err) {
                gutil.log(err);
                gutil.beep();
            }
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('src/demo/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('inject-demo-js', function () {
    gulp.src('index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('.'));
});

//failsafe reporter defined within closure scope
gulp.task('js-watcher', (function (reporter) {
    return function () {
        return watch(globs.js, {name: 'JS-Watcher'})
            .pipe(plumber())
            .pipe(jshint())
            .pipe(reporter)
            .pipe(jshint.reporter(stylish));
    };
})(map(function (file, cb) {
    if (file.jshint.success)
        gulp.start('compile-js');
    else
        gutil.beep();
    //cb continues the stream
    cb(null, file);
})));

gulp.task('compile-js', function () {
    var templates = gulp.src(globs.dist.templates)
        .pipe(templateCache('templates.js', { module: 'fg.geekstrap.templates', standalone: true }));
    var src = merge(templates, gulp.src(globs.dist.js).pipe(angularFilesort()))
        .pipe(concat('geekstrap.min.js'));
    return merge(templates, src)
        .pipe(concat('geekstrap.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('ngdocs', ['compile-js'], function () {
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

gulp.task('compile', ['compile-js']);

gulp.task('demo', [
    'compile',
    'sass',
    'browser-sync',
    'inject-demo-js'
], function () {
    gulp.watch(globs.style, ['sass']);
});

gulp.task('default', ['demo', 'js-watcher']);
