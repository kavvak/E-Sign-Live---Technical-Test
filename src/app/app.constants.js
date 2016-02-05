(function(module) {
	'use strict';

  module.constant('TICKET_PRICE', 10);
  module.constant('LOTTERY_BALLS', 2);
  module.constant('INITIAL_POT_AMOUNT', 200);
	module.constant('NUMBER_OF_WINNERS', 3);
  module.constant('WINNER_PRICE', {
    0: 75,
    1: 15,
    2: 10
  });

})(angular.module('lottery'));
