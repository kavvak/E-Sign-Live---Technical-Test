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
			for (var i = 50; i > 0; i--) {
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
				showBall(ball, 'You just bought this ball.');
			} else {
				self.cachedTickets.push({name: name, price: TICKET_PRICE});
			}
		}

		function payTheTicket(ball, name, ticketPrice) {
			ball.assignName(name);
			self.assignedBalls.push(name);
			self.potAmount = self.potAmount + ticketPrice;
		}

		function showBall(ball) {
			$mdDialog.show({
				controller: function($scope) {
					$scope.ball = ball;
				},
				templateUrl: 'app/dialogs/bought-ball.html',
				parent: angular.element(document.body),
				clickOutsideToClose: true
			});
		}

		function openBuyTicket(ev) {
			$mdDialog.show({
				controller: 'BuyTicketController',
				templateUrl: 'app/dialogs/buy-ticket.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			}).then(function(name) {
				self.buyNewTicket(name);
			});
		}
	});
})(angular.module('lottery'));
