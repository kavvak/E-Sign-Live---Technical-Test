'use strict';

describe('Lottery Ball', function () {
  var Ball;

  beforeEach(angular.mock.module('lottery'));

  beforeEach(inject(function(_Ball_) {
    Ball = _Ball_;
  }));

  it('should have the expected number when a new ball is initialized', function() {
    var ball = new Ball(1);
    expect(ball.number).to.equal(1);
  });

  it('should not have name when a new ball is initialized', function() {
    var ball = new Ball(1);
    expect(ball.isAssigned()).to.equal(false);
    expect(ball.name).to.equal(undefined);
  });

  it('should assign a name when a new ball is assigned', function() {
    var ball = new Ball(1);
    ball.assignName('name');
    expect(ball.isAssigned()).to.equal(true);
    expect(ball.name).to.equal('name');
  });
});
