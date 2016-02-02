(function(module) {
	'use strict';

	module.controller('BuyTicketController', function($scope, $mdDialog) {
		$scope.ok = function() {
			if (!$scope.newBuyerForm.$invalid) {
				$mdDialog.hide($scope.newBuyer);
			}
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};
	});
})(angular.module('lottery'));
