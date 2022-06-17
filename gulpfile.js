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

// Compile the typescript files
gulp.task('compile', () => {
    const tsc = typescript.createProject('tsconfig.json', {
        typescript: require('ttypescript')
    });

    return gulp.src('src/**/*.ts').pipe(tsc()).pipe(gulp.dest('build'));
});

// Uglify the build
gulp.task('uglify', () =>
    gulp
        .src('build/**/*.js')
        .pipe(uglify({ mangle: { toplevel: true } }))
        .pipe(gulp.dest('build'))
);

// Optimise image files
gulp.task('optimise', () => gulp.src('assets/**/*.png').pipe(imagemin()).pipe(gulp.dest('assets')));

gulp.task('build:dev', gulp.series('clean', 'compile'));
gulp.task('build:prod', gulp.series('build:dev', 'uglify', 'optimise'));
