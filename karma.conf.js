module.exports = function(config) {
  config.set({

    basePath: './src',

    files: [
        'bower_components/angular/angular.js',
        'bower_components/ngstorage/ngStorage.js',
        'bower_components/angular-translate/angular-translate.min.js',
        'bower_components/angular-growl-notifications/dist/angular-growl-notifications.min.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'modules/shared/ngServiceGallery.common.module.js',
        'modules/shared/configs/*.js',
        'modules/shared/services/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
