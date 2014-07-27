// nodebotsdaysf
// http://start.tessel.io/blinky

var tessel = require('tessel');

var led1 = tessel.led[0].output(1);
var led2 = tessel.led[1].output(0);

setInterval(function () {
    console.log('I am blinking! Press ctrl+c to stop');

    led1.toggle();
    led2.toggle();
}, 100);