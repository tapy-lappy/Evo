/// <binding BeforeBuild='copy:node_modules' />


var gulp = require("gulp"),
    merge = require("merge-stream"),
    rimraf = require("rimraf");

var paths = {
    webroot: "./wwwroot/",
    node_modules: "./node_modules/"
};

paths.libDest = paths.webroot + "node_modules/";

gulp.task("clean:node_modules", function (cb) {
    rimraf(paths.libDest, cb);
});

gulp.task("copy:node_modules", ["clean:node_modules"], function () {
    var angular2 = gulp.src(paths.node_modules + "@angular/**/bundles/**/*.js")
        .pipe(gulp.dest(paths.libDest + "@angular"));

    var zone_js = gulp.src(paths.node_modules + "zone.js/**/dist/**/zone.js")
        .pipe(gulp.dest(paths.libDest + "zone.js"));

    var reflect_metadata = gulp.src(paths.node_modules + "reflect-metadata/Reflect.js")
        .pipe(gulp.dest(paths.libDest + "reflect-metadata"));

    var core_js = gulp.src(paths.node_modules + "core-js/shim.js")
        .pipe(gulp.dest(paths.libDest + "core-js"));

    var es6_shim = gulp.src([
            paths.node_modules + "es6-shim/*.js",
            "!**/Gruntfile.js"])
        .pipe(gulp.dest(paths.libDest + "es6-shim"));

    var systemjs = gulp.src(paths.node_modules + "systemjs/**/dist/*.js")
        .pipe(gulp.dest(paths.libDest + "systemjs"));

    var rxjs = gulp.src(paths.node_modules + "rxjs/**/*.js")
        .pipe(gulp.dest(paths.libDest + "rxjs"));

    return merge(angular2, zone_js, reflect_metadata, core_js, es6_shim, systemjs, rxjs);
});