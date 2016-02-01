(function(module) {
	'use strict';
	/**
	 * This is the Lottery App Controller.
	 */
	module.controller('LotteryController', function() {
		var self = this;
		self.getPotAmount = getPotAmount;

		//Amount of money in Pot
		var pot = 200;

		function getPotAmount() {
			return pot;
		}
	});

})(angular.module('lottery'));
