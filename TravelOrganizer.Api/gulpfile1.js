/// <binding BeforeBuild='copy-assets' />
"use strict";

var _ = require('lodash'),
    gulp = require('gulp');

gulp.task('copy-assets', function () {
    var assets = {
        js: [
            './node_modules/bootstrap/dist/js/bootstrap.js',
            './node_modules/systemjs/dist/system.src.js',
            './node_modules/angular2/bundles/angular2.dev.js',
            './node_modules/angular2/bundles/router.dev.js',
            './node_modules/angular2/bundles/angular2-polyfills.js',
            './node_modules/angular2/bundles/http.dev.js',
            './node_modules/rxjs/bundles/Rx.js',
            './node_modules/typescript/lib/typescript.js'
        ],
        css: ['./node_modules/bootstrap/dist/css/bootstrap.css']
    };
    _(assets).forEach(function (assets, type) {
        gulp.src(assets).pipe(gulp.dest('./wwwroot/node_modules/' + type));
    });
});