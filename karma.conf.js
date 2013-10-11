module.exports = function(config) {

    var files = [];

    [
        'jquery/jquery.min.js',
        'angular-unstable/angular.min.js',
        'angular-mocks-unstable/angular-mocks.js',
        'lodash/dist/lodash.min.js'
    ].forEach(function(file) {
        files.push('public/vendor/' + file);
    });

    files.push('public/scripts/*.js');
    files.push('test/**/*.js');

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: files,
        exclude: [],
        port: 7070,
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS']
    });
};
