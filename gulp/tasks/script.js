const gulp = require('gulp')
const babel = require('gulp-babel')
const terser = require('gulp-terser')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')

module.exports = function script (cb)
{
    return gulp.src(`src/js/*.js`)
        .pipe(babel({presets: ["@babel/preset-env"]}))
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/js'))
}
