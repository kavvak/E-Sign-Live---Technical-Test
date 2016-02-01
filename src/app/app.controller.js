(function(module) {
	'use strict';
	/**
	 * This is the Lottery App Controller.
	 */
	module.controller('LotteryController', function(Ball, $mdDialog) {
		var TICKET_PRICE = 10;

		var self = this;
		self.buyNewTicket = buyNewTicket;
		self.initialize = initialize;
		self.openBuyTicket = openBuyTicket;

		//Amount of money in Pot
		self.potAmount = 200;

		self.lotteryBalls = [];
		self.unassignedBalls = [];
		self.assignedBalls = [];
		self.cachedTickets = [];

		self.initialize();

		function initialize() {
			for (var i = 1; i <= 50; i++) {
				var ball = new Ball(i);
				self.lotteryBalls.push(ball);
				if (self.cachedTickets.length) {
					var ticket = self.cachedTickets.pop();
					payTheTicket(ball, ticket.name, ticket.price);
				} else {
					self.unassignedBalls.push(ball);
				}
			}
		}

		function buyNewTicket(name) {
			if (self.unassignedBalls.length) {
				var ball = self.unassignedBalls.pop();
				payTheTicket(ball, name, TICKET_PRICE);
			} else {
				self.cachedTickets.push({name: name, price: TICKET_PRICE});
			}
		}

		function payTheTicket(ball, name, ticketPrice) {
			ball.assignName(name);
			self.assignedBalls.push(name);
			self.potAmount = self.potAmount + ticketPrice;
		}

		function openBuyTicket(ev) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/dialogs/buy-ticket.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			}).then(function(results) {
				console.log(results);
				self.buyNewTicket(self.newBuyer);
			});
		}
	});
})(angular.module('lottery'));

function DialogController($scope, $mdDialog) {
	'use strict';

  $scope.ok = function() {
		if (!$scope.newBuyerForm.$invalid) {
			$mdDialog.hide($scope.newBuyer);
		}
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
}
