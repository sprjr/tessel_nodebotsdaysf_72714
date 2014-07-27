// nodebotsdaysf
// http://start.tessel.io/modules/camera

var tessel = require('tessel'),
    camera = require('camera-vc0706').use(tessel.port['B']);

var notificationLED = tessel.led[3];

camera.on('ready', function () {
    notificationLED.high();

    camera.takePicture(function (err, image) {
        if (err) {
            console.log('error taking image', err);
        }

        notificationLED.low();

        var name = 'picture-' + new Date().getTime() + '.jpg';

        console.log('Saving picture as...', name, '...');
        process.sendfile(name, image);
        console.log('done.');

        camera.disable();
    })
});

camera.on('error', function (err) {
    console.error(err);
});