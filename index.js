var rpio = require('rpio');

rpio.init();

rpio.open(40, rpio.INPUT,rpio.PULL_UP);

rpio.poll(40, function(pin) {
    console.log('pressed');
}, rpio.POLL_LOW);

