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

var globs = {
  sass: ['sass/**/*.scss', 'src/**/*.scss'],
  js: 'src/**/*.js',
  html: '*/**/*.html',
  css: 'css/*.css',
  bower: mainBowerFiles()
};

var beep = console.log.bind(console, '\007');

gulp.task('inject', function () {
  return gulp.src('./index.html')
    .pipe(inject(gulp.src(globs.bower), {relative: true, name: 'bower'}))
    .pipe(inject(gulp.src(globs.css), {relative: true}))
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

gulp.task('reload', function () {
  gulp.src('./index.html')
    .pipe(connect.reload());
});

gulp.task('sass-parser', function () {
  return watch(globs.sass, {name: 'Sass-Parser'}, function (files, cb) {
    return gulp.start('compile-sass');
  })
});

//failsafe reporter defined within closure scope
(function (reporter) {
  gulp.task('js-parser', function () {
    return watch(globs.js, {name: 'JS-Parser'})
    .pipe(plumber())
    .pipe(jshint())
    .pipe(reporter)
    .pipe(jshint.reporter(stylish));
  });
})(map(function (file, cb) {
  if (file.jshint.success)
    gulp.start('build');
  else
    beep();
  //cb continues the stream
  cb(null, file);
}));

gulp.task('file-watcher', function () {
  return watch(globs.html, {name: 'File-Watcher'}, function (files, cb) {
    return gulp.start('reload');
  });
});

gulp.task('build', function () {
  gulp.src('./index.html')
    .pipe(inject(gulp.src(globs.bower), {relative: true, name: 'bower'}))
    .pipe(inject(gulp.src(globs.css), {relative: true}))
    .pipe(inject(gulp.src(globs.js).pipe(angularFilesort()), {relative: true}))
    .pipe(plumber())
    .pipe(gulp.dest('./'))
    .on('end', function () {
      gulp.start('reload');
    });
});

gulp.task('compile-sass', function () {
  return gulp.src(globs.sass)
    .pipe(sass({
      onError: function (err) {
        console.log(err);
        beep();
      }
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('css'))
    .on('end', function () {
      gulp.start('reload');
    });
});

gulp.task('compile', ['compile-sass'], function () {
  return gulp.start('build');
});

gulp.task('watch', ['compile', 'sass-parser', 'js-parser']);

gulp.task('default', ['connect', 'watch']);
