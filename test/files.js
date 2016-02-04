'use strict';

module.exports = {
  app: [
    'src/app/**/*.html',
    'src/app/**/*.module.js',
    'src/app/**/*.js'
  ],

  libs: [
    // ES5 polyfill
    'node_modules/es5-shim/es5-shim.js',
    'node_modules/es5-shim/es5-sham.js',

    // External
    'dist/lib/angular/angular.js',
    'dist/lib/jquery/dist/jquery.js',
    'dist/lib/lodash/lodash.js',
    'dist/lib/angular-messages/angular-messages.js',
    'dist/lib/angular-sanitize/angular-sanitize.js',
    'dist/lib/angular-material/angular-material.js',
    'dist/lib/angular-animate/angular-animate.js',
    'dist/lib/angular-aria/angular-aria.js',
    'dist/lib/angular-mocks/angular-mocks.js',
    'dist/lib/angular-translate/angular-translate.js',
    'dist/lib/angular-ui-router/release/angular-ui-router.js'
  ],

  testLibs: [
    'node_modules/chai/chai.js',
    'node_modules/chai-as-promised/lib/chai-as-promised.js',
    'node_modules/chai-jquery/chai-jquery.js',
    'node_modules/chai-things/lib/chai-things.js',
    'node_modules/sinon/pkg/sinon.js',
    'node_modules/sinon-chai/lib/sinon-chai.js',
    'test/bootstrap.js',
    'test/mock/**/*.module.js',
    'test/mock/**/*.js'
  ]
};
