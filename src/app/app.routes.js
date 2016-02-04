(function(module) {
  'use strict';

  module.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('default', {
        url: '/',
        templateUrl: 'app/app.html',
        controller: 'LotteryController as ctrl'
      })
      .state('home', {
        url: '/home',
        templateUrl: 'app/app.html',
        controller: 'LotteryController as ctrl'
      })
      .state('404', {
        url: '/*location',
        templateUrl: 'app/404.html',
        controllerAs: 'error'
      });

    $urlRouterProvider.otherwise('/404');

  })
  .run();

})(angular.module('lottery'));
