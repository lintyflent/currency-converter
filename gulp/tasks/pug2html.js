const gulp = require('gulp')
const pug = require('gulp-pug')
// const htmlValidator = require('gulp-w3c-html-validator')

module.exports = function pug2html(cd)
{
    return gulp.src(`src/pages/*.pug`)
        // .pipe(htmlValidator())
        // .pipe(htmlValidator.reporter())
        .pipe(pug())
        .pipe(gulp.dest('build'))
}
