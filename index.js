var rpio = require('rpio');
var _ = require('lodash');

rpio.init();

rpio.open(40, rpio.INPUT,rpio.PULL_UP);

rpio.poll(40, _.throttle(function(pin) {
    console.log('pressed', Date.now());
}, 500, {trailing: false}), rpio.POLL_LOW);

