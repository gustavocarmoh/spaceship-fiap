var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var cleanCSS = require("gulp-clean-css");
var less = require("gulp-less");
var rename = require('gulp-rename');
var del = require("del");

const paths = {
  styles: {
    src: "./src/styles/**/*.less",
    dest: "./dist/assets/styles/",
  },
  scripts: {
    src: "./src/*.js",
    dest: "./dist/",
  },
};

/*
 * For small tasks you can export arrow functions
 */
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del(["assets"]);
}

/*
 * You can also declare named functions and export them as tasks
 */
function styles() {
  return (
    gulp
      .src(paths.styles.src)
      .pipe(less())
      .pipe(cleanCSS())
      // pass in options to the stream
      .pipe(
        rename({
          basename: "main",
          suffix: ".min",
        })
      )
      .pipe(gulp.dest(paths.styles.dest))
  );
}

function scripts() {
  return gulp
    .src(paths.scripts.src, { sourcemaps: true })
    .pipe(concat("/dist"))
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat("dist.min.js"))
    .pipe(gulp.dest(paths.scripts.dest));
}

/*
 * You could even use `export as` to rename exported tasks
 */
function watch() {
  gulp.watch(paths.scripts.src, scripts);
  //gulp.watch(paths.styles.src, styles);
}
var build = gulp.series(clean, gulp.parallel(styles, scripts));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;
