(function(module) {
  'use strict';

  function BallFactory() {
    /**
     * @ngdoc type
     * @name Ball
     * @kind class
     * @module lottery
     *
     * @description
     * represents a Ball that will be drawn in the lottery
     *
     * @property {number} number, example: 10
     * @property {string} name, example: 'Kaveh'
     */
    function Ball(number) {
      this.number = number;
    }

    Ball.prototype.assignName = function(name) {
      this.name = name;
    };

    Ball.prototype.isAssigned = function() {
      return !!this.name;
    };

    return Ball;
  }

  module.factory('Ball', BallFactory);
})(angular.module('lottery'));
