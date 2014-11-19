var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  plumber = require('gulp-plumber');

function onError(err) {
  console.log(err.message || err);
  this.emit('end');
}

gulp.task('tests', function () {
  return gulp.src('test/**/*.js', { read: false })
    .pipe(plumber())
    .pipe(mocha({ reporter: 'dot' }))
    .on('error', onError);
});

gulp.task('watch', ['tests'], function () {
  gulp.watch(['**/*.js', '!node_modules/**/*.js'], ['tests']);
});

gulp.task('default', ['tests']);
