(function(module) {
	'use strict';
	/**
	 * This is the Lottery App Controller.
	 */
	module.controller('LotteryController', function(Ball, $mdDialog, $timeout,
	TICKET_PRICE, LOTTERY_BALLS, INITIAL_POT_AMOUNT, WINNER_PRICE) {
		var self = this;
		self.buyNewTicket = buyNewTicket;
		self.initialize = initialize;
		self.openBuyTicket = openBuyTicket;
		self.drawBalls = drawBalls;
		self.showWinners = showWinners;

		//Amount of money in Pot
		self.potAmount = INITIAL_POT_AMOUNT;
		self.drawing = false;

		self.winners = [];
		self.lotteryBalls = [];
		self.unassignedBalls = [];
		self.assignedBalls = [];
		self.cachedTickets = [];

		self.initialize();

		function initialize() {
			self.lotteryBalls = [];
			self.unassignedBalls = [];
			self.assignedBalls = [];
			self.winners = [];
			self.drawing = false;

			for (var i = LOTTERY_BALLS; i > 0; i--) {
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
				var buyer = {name: name, price: TICKET_PRICE};
				self.cachedTickets.push(buyer);
				showPurchaseMessage(buyer);
			}
		}

		function showPurchaseMessage(buyer) {
			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element(document.body))
					.clickOutsideToClose(true)
					.title('Lottery tickets are sold out')
					.content(buyer.name + ', you purchased a lottery ticket for ' +
					buyer.price +
					'$. You will be automatically rolled in the next round.')
					.ariaLabel('Sold Out')
					.ok('Got it')
			);
		}

		function payThePrice(winners) {
			angular.forEach(winners, function(ball) {
				if (ball.isAssigned()) {
					self.potAmount -= ball.price;
				}
			});
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

		function drawWinners() {
			return _.sample(self.lotteryBalls, 3);
		}

		function drawBalls(ev) {
			startDrawProcess();
			$timeout(function() {
				self.winners = drawWinners(ev);
				calculatePrices();
				stopDrawProcess();
			}, 3000);
		}

		function calculatePrices() {
			var price = self.potAmount / 2;
			angular.forEach(self.winners, function(ball, index) {
				ball.price = (price * WINNER_PRICE[index] / 100);
			});
		}

		function startDrawProcess() {
			self.drawing = true;
		}

		function stopDrawProcess() {
			self.drawing = false;
		}

		function showWinners(ev) {
			$mdDialog.show({
				controller: function($scope, $mdDialog) {
					$scope.winners = self.winners;
					$scope.ok = function() {
						$mdDialog.hide();
					};
					$scope.cancel = function() {
						$mdDialog.cancel();
					};
				},
				templateUrl: 'app/dialogs/show-winners.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			}).then(function() {
				payThePrice(self.winners);
				initialize();
			});
		}

		function openBuyTicket(ev) {
			$mdDialog.show({
				controller: function($scope, $mdDialog) {
					$scope.ticketPrice = TICKET_PRICE;
					$scope.ok = function() {
						if (!$scope.newBuyerForm.$invalid) {
							$mdDialog.hide($scope.newBuyer);
						}
					};
					$scope.cancel = function() {
						$mdDialog.cancel();
					};
				},
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
