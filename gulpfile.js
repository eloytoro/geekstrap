var gulp            = require('gulp');
var sass            = require('gulp-sass');
var inject          = require("gulp-inject");
var mainBowerFiles  = require('main-bower-files');
var rename          = require('gulp-rename');
var minifycss       = require('gulp-minify-css');
var angularFilesort = require('gulp-angular-filesort');
var connect         = require('gulp-connect');

gulp.task('build', ['sass'], function () {
  var target = gulp.src('./index.html');
  var bower = gulp.src(mainBowerFiles());
  var src = gulp
  .src('./src/**/*.js')
  .pipe(angularFilesort());

  return target
  .pipe(inject(bower, {relative: true, name: 'bower'}))
  .pipe(inject(gulp.src('./css/**/*.min.css'), {relative: true}))
  .pipe(inject(src, {relative: true}))
  .pipe(gulp.dest('./'));
});

gulp.task('sass', function () {
  var files = mainBowerFiles().filter(function(element) {
    return element.substring(element.indexOf('.scss')) == '.scss'
      || element.substring(element.indexOf('.sass')) == '.sass';
  });
  files.push('./sass/*.{sass,scss}', './src/**/*.{sass,scss}');
  return gulp
  .src(files)
  .pipe(sass({
    errLogToConsole: true
    // sourceComments: 'map'  -- Broken in current version of nodejs/libsass
  }))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('css'));
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    port: 8000,
    livereload: true
  });
});

gulp.task('reload', ['build'], function() {
  gulp.src('./index.html')
  .pipe(connect.reload());
});

gulp.task('watch', ['build'], function () {
  gulp.watch([
    './sass/*.{sass,scss}',
    './src/**/*.{sass,scss}',
    './src/**/*.js',
    './**/*.html'
  ], ['reload']);
});

gulp.task('deploy', ['build']);

gulp.task('default', ['connect', 'watch']);
