const gulp = require('gulp');
const path = require('path');
const rimraf = require('rimraf');
const typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const colours = require('picocolors');
const figures = require('figures');
const dayjs = require('dayjs');

const log = message => {
    console.log(
        `${colours.gray(`[${dayjs().format('hh:mm:ss A').toUpperCase()}] [gulp] ›`)} ${colours.red(
            `${figures.play}  ${colours.underline(colours.bold('gulp'))}`
        )}   ${message}`
    );
};

// Clean the old build directory
gulp.task('clean', () => {
    return new Promise((resolve, reject) => {
        rimraf(path.join(__dirname, 'build'), e => (e ? reject(e) : resolve()));
    });
});

// Build the typescript files
gulp.task('build', () => {
    const tsc = typescript.createProject('tsconfig.json', {
        typescript: require('ttypescript')
    });

    return gulp
        .src('src/**/*.ts')
        .pipe(tsc())
        .pipe(uglify({ mangle: { toplevel: true } }))
        .pipe(gulp.dest('build'));
});

// Optimise image files
gulp.task('optimise', () => {
    return gulp.src('assets/**/*.png').pipe(imagemin()).pipe(gulp.dest('assets'));
});

gulp.task('default', gulp.series('clean', 'build'));
