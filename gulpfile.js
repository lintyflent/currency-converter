const gulp = require('gulp')

const pug2html = require('./gulp/tasks/pug2html')
const styles = require('./gulp/tasks/styles')
const script = require('./gulp/tasks/script')

module.exports.pu = gulp.series(pug2html)
module.exports.sc = gulp.series(script)
module.exports.st = gulp.series(styles)

module.exports.start = function (cd)
{
    module.exports.pu();
    module.exports.sc();
    module.exports.st();
    cd();
}

module.exports.watch = function (cd)
{
    gulp.watch('src/pages/**/*.pug',  gulp.parallel(pug2html));
    gulp.watch('src/js/**/*.js',  gulp.parallel(script));
    gulp.watch('src/styles/**/*.sass',   gulp.parallel(styles));
    cd();
}
