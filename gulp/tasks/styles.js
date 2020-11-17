const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer  =  require('gulp-autoprefixer');

module.exports = function styles()
{
    return gulp.src(`src/styles/*.sass`)
        .pipe(sass({outputStyle: 'compressed',}))
        .pipe(autoprefixer(['last 10 versions'], { cascade: true }))
        .pipe(sourcemaps.write('build/css'))
        .pipe(gulp.dest('build/css'))
}
