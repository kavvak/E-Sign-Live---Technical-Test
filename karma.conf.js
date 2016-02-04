'use strict';

var files = require('./test/files');

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],

    files: [].concat(
      files.libs,
      files.app,
      files.testLibs
    ),

    'plugins': [
      'karma-mocha',
      'karma-coverage',
      'karma-jshint-preprocessor',
      'karma-mocha-reporter',
      'karma-chrome-launcher'
    ],

    preprocessors: {
      'src/app/**/*.spec.js': ['jshint'],
      'src/app/**/!(*.spec).js': ['coverage'],
      'test/mock/**/*.js': ['jshint']
    },

    jshintPreprocessor: {
      stopOnError: true
    },

    reporters: ['mocha', 'coverage'],

    mochaReporter: {
      output: 'minimal'
    },

    coverageReporter: {
      dir: 'test/reports/coverage',

      reporters: [
        {type: 'text-summary'},
        {type: 'cobertura'},
        {type: 'lcov'},
        {type: 'json'}
      ],

      check: {
        global: {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90
        }
      }
    },

    reportSlowerThan: 10,

    autoWatch: true,

    browsers: ['Chrome'],
    browserNoActivityTimeout: 30000
  });
};
