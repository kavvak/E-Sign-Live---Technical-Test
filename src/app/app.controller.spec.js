'use strict';

describe('Lottery Controller', function () {
  var $controller;
  var controller;
  var $rootScope;
  var $scope;
  var $timeout;
  var $mdDialog;
  var $q;
  var INITIAL_POT_AMOUNT = 200;
  var LOTTERY_BALLS = 50;
  var TICKET_PRICE = 10;
  var NUMBER_OF_WINNERS = 3;
  var WINNER_PRICE = {
    0: 75,
    1: 15,
    2: 10
  };
  var Buyer = 'Kaveh';
  var winners1;
  var winners2;
  var Ball;

  beforeEach(angular.mock.module('lottery'));

  beforeEach(inject(function(_$rootScope_, _$controller_, _$mdDialog_,
    _$timeout_, _$q_, _Ball_) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    Ball = _Ball_;
    $controller = _$controller_;
    $timeout = _$timeout_;
    $mdDialog = _$mdDialog_;
    $q = _$q_;

    var winner1 = new Ball(1);
    var winner2 = new Ball(2);
    var winner3 = new Ball(3);
    winner1.assignName('name1');
    winner2.assignName('name2');
    winner3.assignName('name3');
    winners1 = [winner1, winner2, winner3];

    var winner4 = new Ball(1);
    var winner5 = new Ball(2);
    var winner6 = new Ball(3);
    winner4.assignName('name1');
    winner6.assignName('name2');
    winners2 = [winner4, winner5, winner6];
  }));

  function initController(lotteryBalls) {
    controller = $controller('LotteryController', {
      $scope: $scope,
      $timeout: $timeout,
      INITIAL_POT_AMOUNT: INITIAL_POT_AMOUNT,
      LOTTERY_BALLS: lotteryBalls ? lotteryBalls : LOTTERY_BALLS,
      TICKET_PRICE: TICKET_PRICE,
      WINNER_PRICE: WINNER_PRICE
    });
    $rootScope.$digest();
  }

  it('should be defined', function() {
    initController();
    expect(controller).to.be.defined;
  });

  it('should have the initial state', function() {
    initController();
    expect(controller.potAmount).to.equal(INITIAL_POT_AMOUNT);
    expect(controller.lotteryBalls.length).to.equal(LOTTERY_BALLS);
    expect(controller.unassignedBalls.length).to.equal(LOTTERY_BALLS);
    expect(controller.assignedBalls.length).to.equal(0);
    expect(controller.winners.length).to.equal(0);
    expect(controller.drawing).to.equal(false);
  });

  it('should assign the buyer\'s name to the ball when a ticket is bought', function() {
    initController();
    sinon.spy(Ball.prototype, 'assignName');
    sinon.spy(controller, 'showBall');
    controller.buyNewTicket(Buyer);
    expect(controller.unassignedBalls.length).to.equal(LOTTERY_BALLS - 1);
    expect(controller.assignedBalls.length).to.equal(1);
    expect(Ball.prototype.assignName).to.have.been.calledWithMatch(Buyer);
    expect(controller.showBall).to.have.been.calledWithMatch(controller.assignedBalls[0]);
  });

  it('should not assign the buyer\'s name to the ball when all balls are sold', function() {
    initController(2);
    sinon.spy(Ball.prototype, 'assignName');
    controller.buyNewTicket('name1');
    controller.buyNewTicket('name2');
    controller.buyNewTicket('name3');
    expect(controller.unassignedBalls.length).to.equal(0);
    expect(controller.assignedBalls.length).to.equal(2);
    expect(controller.assignedBalls[0].name).to.equal('name1');
    expect(controller.assignedBalls[1].name).to.equal('name2');
    expect(Ball.prototype.assignName).to.have.been.calledTwice;
  });

  it('should show the dialog with the ball number when buyer bought a ticket', function() {
    initController();
    sinon.spy($mdDialog, 'show');
    controller.buyNewTicket(Buyer);
    expect($mdDialog.show).to.have.been.calledOnce;
  });

  it('should show the buy new ticket dialog when buyer wants to buy a ticket', function() {
    initController();
    sinon.spy($mdDialog, 'show');
    controller.openBuyTicket();
    expect($mdDialog.show).to.have.been.calledOnce;
  });

  it('should show the winners dialog when winning balls are drawn', function() {
    initController();
    sinon.spy($mdDialog, 'show');
    controller.drawBalls();
    controller.showWinners();
    expect($mdDialog.show).to.have.been.calledOnce;
  });

  it('should call to assign a ball to the buyer when buyer enters a name and presses on buy', function() {
    initController();
    var defer = $q.defer();
    defer.resolve(Buyer);
    sinon.stub($mdDialog, 'show').returns(defer.promise);
    sinon.spy(controller, 'buyNewTicket');
    controller.openBuyTicket();
    $rootScope.$digest();
    expect(controller.buyNewTicket).to.have.been.calledWithMatch(Buyer);
  });

  it('should call to pay the price to winners when asking to start a new round of lottery', function() {
    initController();
    var defer = $q.defer();
    defer.resolve();
    sinon.stub($mdDialog, 'show').returns(defer.promise);
    sinon.spy(controller, 'payThePrice');
    controller.showWinners();
    $rootScope.$digest();
    expect(controller.payThePrice).to.have.been.calledWithMatch(controller.winners);
  });

  it('should reduce the price from pot amount when paying the prices and some balls are assigned', function() {
    initController();
    winners2[0].price = INITIAL_POT_AMOUNT / 2 * WINNER_PRICE[0] / 100;
    winners2[1].price = INITIAL_POT_AMOUNT / 2 * WINNER_PRICE[1] / 100; //not bought
    winners2[2].price = INITIAL_POT_AMOUNT / 2 * WINNER_PRICE[2] / 100;
    controller.payThePrice(winners2);
    expect(controller.potAmount).to.equal((INITIAL_POT_AMOUNT / 2) + winners2[1].price);
  });

  it('should reduce half of the pot amount when paying the prices and all balls are assigned', function() {
    initController();
    winners1[0].price = INITIAL_POT_AMOUNT / 2 * WINNER_PRICE[0] / 100;
    winners1[1].price = INITIAL_POT_AMOUNT / 2 * WINNER_PRICE[1] / 100;
    winners1[2].price = INITIAL_POT_AMOUNT / 2 * WINNER_PRICE[2] / 100;
    controller.payThePrice(winners1);
    expect(controller.potAmount).to.equal(INITIAL_POT_AMOUNT / 2);
  });

  it('should reinitialize when restaring the lottery but keep the pot amount as it is', function() {
    initController();
    winners1[0].price = INITIAL_POT_AMOUNT / 2 * WINNER_PRICE[0] / 100;
    winners1[1].price = INITIAL_POT_AMOUNT / 2 * WINNER_PRICE[1] / 100;
    winners1[2].price = INITIAL_POT_AMOUNT / 2 * WINNER_PRICE[2] / 100;
    controller.payThePrice(winners1);
    expect(controller.potAmount).to.equal(INITIAL_POT_AMOUNT / 2);
    expect(controller.lotteryBalls.length).to.equal(LOTTERY_BALLS);
    expect(controller.unassignedBalls.length).to.equal(LOTTERY_BALLS);
    expect(controller.assignedBalls.length).to.equal(0);
    expect(controller.winners.length).to.equal(0);
    expect(controller.drawing).to.equal(false);
  });

  it('should have winning balls after drawing balls', function() {
    initController();
    controller.drawBalls();
    $timeout.flush();
    expect(controller.winners.length).to.equal(NUMBER_OF_WINNERS);
  });

  it('should set price of the winning balls when drawing winning balls', function() {
    initController();
    sinon.spy(Ball.prototype, 'setPrice');
    controller.drawBalls();
    $timeout.flush();
    $rootScope.$digest();
    expect(Ball.prototype.setPrice).to.have.been.calledTrice;
  });

  it('should calculate the prices for all winner balls', function() {
    initController();
    sinon.stub(controller, 'drawWinners').returns(winners1);
    controller.drawBalls();
    $timeout.flush();
    $rootScope.$digest();
    expect(controller.winners[0].price).to.equal(INITIAL_POT_AMOUNT / 2 * WINNER_PRICE[0] / 100);
    expect(controller.winners[1].price).to.equal(INITIAL_POT_AMOUNT / 2 * WINNER_PRICE[1] / 100);
    expect(controller.winners[2].price).to.equal(INITIAL_POT_AMOUNT / 2 * WINNER_PRICE[2] / 100);
  });
});
