'use strict';

describe('Lottery Routes', function () {
  var $state;
  var $location;
  var $rootScope;
  var $httpBackend;

  beforeEach(angular.mock.module('lottery'));

  beforeEach(inject(function(_$location_, _$rootScope_, _$state_, _$httpBackend_) {

    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    $location = _$location_;
    $location.url('test');
  }));

  it('should respond to the domain with default state', function() {
    expect($state.href('default')).to.equal('/');
  });

  it('should respond to the domain/home with default state', function() {
    expect($state.href('home')).to.equal('/home');
  });

  it('should respond to any invalid url with 404 state', function() {
    $httpBackend.when('GET', 'app/404.html').respond(200);
    $location.url('test');
    $rootScope.$apply();
    $httpBackend.expectGET('app/404.html');
  });
});
