var gulp            = require('gulp');
var sass            = require('gulp-sass');
var wiredep         = require('wiredep').stream;
var rename          = require('gulp-rename');
var minifycss       = require('gulp-minify-css');
var angularFilesort = require('gulp-angular-filesort');
var jshint          = require('gulp-jshint');
var stylish         = require('jshint-stylish');
var ngdocs          = require('gulp-ngdocs');
var uglify          = require('gulp-uglify');
var concat          = require('gulp-concat');
var templateCache   = require('gulp-angular-templatecache');
var gutil           = require('gulp-util');
var browserSync     = require('browser-sync');
var inject          = require('gulp-inject');
var ngAnnotate      = require('gulp-ng-annotate');
var flatten         = require('gulp-flatten');

var globs = {
    scss: 'src/**/*.scss',
    js: 'src/**/*.js',
    html: 'src/**/*.html',
    dist: {
        js: 'src/geekstrap/**/*.js',
        templates: 'src/geekstrap/**/*.html'
    },
    demo: {
        js: 'src/demo/**/*.js',
        scss: 'src/demo/**/*.scss',
        css: 'src/demo/**/*.css',
        html: 'src/demo/**/*.html'
    }
};

gulp.task('compile-demo-scss', function () {
    return gulp.src(globs.demo.scss)
        .pipe(sass({
            onError: function (err) {
                gutil.log(err);
                gutil.beep();
            }
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(flatten())
        .pipe(gulp.dest('src/demo/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('jshint', function () {
    gulp.src(globs.dist.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js-watcher', function () {
    return gulp.watch([globs.dist.js, globs.demo.js], ['jshint', 'reload'])
});

gulp.task('compile-templates', function () {
    return gulp.src(globs.dist.templates)
        .pipe(templateCache('templates.js', {
            module: 'fg.geekstrap',
            root: 'geekstrap',
            standalone: false
        }))
        .pipe(gulp.dest('src/geekstrap'));
});

gulp.task('html-watcher', function () {
    return gulp.watch([globs.demo.html, 'index.html'], ['reload']);
});

gulp.task('template-watcher', function () {
    return gulp.watch(globs.dist.templates, ['compile-templates']);
});

gulp.task('scss-watcher', function () {
    return gulp.watch(globs.scss, ['compile-demo-scss']);
});

gulp.task('compile-js', ['compile-templates'], function () {
    return gulp.src(globs.dist.js)
        .pipe(angularFilesort())
        .pipe(ngAnnotate())
        .pipe(concat('geekstrap.min.js'))
        .pipe(uglify())
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

gulp.task('compile-demo', ['compile-demo-scss', 'compile-templates'], function () {
    return gulp.src('index.html')
        .pipe(inject(
            gulp.src([globs.dist.js, globs.demo.js])
                .pipe(angularFilesort())
        ))
        .pipe(wiredep())
        .pipe(gulp.dest('.'));
});

gulp.task('demo', [
    'js-watcher',
    'scss-watcher',
    'html-watcher',
    'template-watcher',
    'compile-demo'
], function () {
    browserSync({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('default', ['demo']);
