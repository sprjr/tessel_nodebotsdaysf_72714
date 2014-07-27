// nodebotsdaysf
// http://start.tessel.io/modules/ble

var tessel = require('tessel'),
    blelib = require('ble-ble113a');

var ble    = blelib.use(tessel.port['A']);

ble.on('ready', function (err) {
    console.log('Scanning...')
    ble.startScanning();
});

ble.on('discover', function (peripheral) {
    console.log('Discovered peripheral!', peripheral.address.toString());
});