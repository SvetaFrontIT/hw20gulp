const { series, src, dest, watch } = require('gulp');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

function cleanDist() {
    return src('dist', { read: false }).pipe(clean());
}

function copyHtml() {
    return src('src/index.html').pipe(dest('./dist'));
}

function copyVendorsJs() {
    return src([
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/jquery-ui/dist/jquery-ui.min.js',

        ])
        .pipe(concat('vendors.js'))
        .pipe(dest('./dist'));
}

function copyVendorsCss() {
    return src([
            './node_modules/bootstrap/dist/css/bootstrap.min.css',
            './node_modules/jquery-ui/dist/jquery-ui.min.css',
        ])
        .pipe(concat('vendors.css'))
        .pipe(dest('./dist'));
}

function copyCss() {
    return src('src/**/*.css')
        .pipe(concat('styles.css'))
        .pipe(dest('./dist'));
}


function copyJs() {
    return src('src/**/*.js')
        .pipe(concat('scripts.js'))
        .pipe(dest('./dist'));
}

function startServer(cb) {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    watch('src/**/*.js', series(copyJs, reloadBrowser));
    watch('src/**/*.css', series(copyCss, reloadBrowser));

    cb()
}

function reloadBrowser(cb) {
    browserSync.reload();

    cb();
}

module.exports = {
    default: series(cleanDist, copyHtml, copyVendorsCss, copyVendorsJs, copyCss, copyJs, startServer),
    build: series(cleanDist, copyHtml, copyVendorsCss, copyVendorsJs, copyCss, copyJs),
}