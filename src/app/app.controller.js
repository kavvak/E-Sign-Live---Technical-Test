(function(module) {
	'use strict';
	/**
	 * This is the Lottery App Controller.
	 */
	module.controller('LotteryController', function(Ball, $mdDialog, $timeout,
	$scope, TICKET_PRICE, LOTTERY_BALLS, INITIAL_POT_AMOUNT,
	WINNER_PRICE, NUMBER_OF_WINNERS) {
		var self = this;
		self.buyNewTicket = buyNewTicket;
		self.initialize = initialize;
		self.openBuyTicket = openBuyTicket;
		self.drawBalls = drawBalls;
		self.showWinners = showWinners;
		self.showBall = showBall;
		self.drawWinners = drawWinners;
		self.payThePrice = payThePrice;
		self.calculatePrices = calculatePrices;

		//Amount of money in Pot
		self.potAmount = INITIAL_POT_AMOUNT;
		//Initial state of the game is not drwing
		self.drawing = false;

		//lottery winner balls
		self.winners = [];

		//lottery balls, assignedBalls and unassignedBalls have same balls as lotteryBalls
		self.lotteryBalls = [];
		self.unassignedBalls = [];
		self.assignedBalls = [];

		self.initialize();

		//initializes the lottery round
		function initialize() {
			self.lotteryBalls = [];
			self.unassignedBalls = [];
			self.assignedBalls = [];
			self.winners = [];
			self.drawing = false;

			for (var i = LOTTERY_BALLS; i > 0; i--) {
				var ball = new Ball(i);
				self.lotteryBalls.push(ball);
				self.unassignedBalls.push(ball);
			}
		}

		//buying a new ticket
		function buyNewTicket(name) {
			if (self.unassignedBalls.length) {
				var ball = self.unassignedBalls.pop();
				ball.assignName(name);
				self.assignedBalls.push(ball);
				self.potAmount = self.potAmount + TICKET_PRICE;
				self.showBall(ball, 'You just bought this ball.');
			}
		}

		//paying the price of the winners and reducing them from pot amount
		function payThePrice(winners) {
			angular.forEach(winners, function(ball) {
				if (ball.isAssigned()) {
					self.potAmount -= ball.price;
				}
			});
		}

		//show the ball that has been bought
		function showBall(ball) {
			var scope = $scope.$new();
			scope.ball = ball;

			$mdDialog.show({
				scope: scope,
				templateUrl: 'app/dialogs/bought-ball.html',
				parent: angular.element(document.body),
				clickOutsideToClose: true
			});
		}

		//draw the winners of the loterry
		function drawWinners() {
			return _.sample(self.lotteryBalls, NUMBER_OF_WINNERS);
		}

		//draw the winners and calculate the price for each winning ball
		function drawBalls() {
			startDrawProcess();
			$timeout(function() {
				self.winners = self.drawWinners();
				self.calculatePrices(self.winners);
				stopDrawProcess();
			}, 1500);
		}

		//calculating the prices for the winning balls and set the ball price
		function calculatePrices(winners) {
			var price = self.potAmount / 2;
			angular.forEach(winners, function(ball, index) {
				ball.setPrice(price * WINNER_PRICE[index] / 100);
			});
		}

		//going to draw mode, everything will be disable
		function startDrawProcess() {
			self.drawing = true;
		}

		//going back to normal mode
		function stopDrawProcess() {
			self.drawing = false;
		}

		//showing the winners of the draw, and asking to restart for a new round
		function showWinners(ev) {
			var scope = $scope.$new();
			scope.$mdDialog = $mdDialog;
			scope.winners = self.winners;

			$mdDialog.show({
				scope: scope,
				templateUrl: 'app/dialogs/show-winners.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			}).then(function() {
				self.payThePrice(self.winners);
				initialize();
			});
		}

		//shows the dialog for buying a new ticket (ball)
		function openBuyTicket(ev) {
			var scope = $scope.$new();
			scope.ticketPrice = TICKET_PRICE;
			scope.$mdDialog = $mdDialog;

			$mdDialog.show({
				scope: scope,
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
