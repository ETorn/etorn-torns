var rpio = {};

rpio.init  = rpio.open = function() {};

rpio.poll = function(pin, cb) {
  setInterval(cb, 5000);
};

try {
  rpio = require('rpio');
} catch (e) {
  console.error('Module rpio not found. If you are running on a raspberry this is an error');
  console.error('Otherwise this will behave as if the button is pressed every 5 seconds.');
}

module.exports = rpio;
