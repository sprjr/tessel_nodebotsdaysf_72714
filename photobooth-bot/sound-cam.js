var tessel      = require('tessel'),
    ambient     = require('ambient-attx4').use(tessel.port('D')),
    camera      = require('camera-vc0706').use(tessel.port['B']),
    util        = require('util');

var NOTIFICATION_LED    = tessel.led[3],
    CAMERA_READY        = false;
    SOUND_THRESHOLD     = 0.15;

// enable the CAMERA_READY for the app
camera.on('ready', function () {
    CAMERA_READY = true;
    camera.setResolution('vga', function noop () {});
    console.log('Connected to Camera Module...');
});

camera.on('err', function (err) {
    CAMERA_READY = false;
    console.log('Camera Error, Feature Unavailable');
    console.error(err);
});

// Listen For Sound Command
ambient.on('ready', function ambientReady () {
    console.log('Connected to Ambient Module...');

    setInterval( function ambientPolling () {
        ambient.getSoundLevel( function getAmbientSoundLevel (err, sdata) {
            console.log("Sound level:", sdata.toFixed(8));
        });
    }, 1000);

    ambient.setSoundTrigger(SOUND_THRESHOLD);

    ambient.on('sound-trigger', function soundTrigger(data) {
        console.log('Sound Threshold Triggered', data);
        ambient.clearSoundTrigger();

        if (!CAMERA_READY) {
            console.log('Camera is not ready for photography, abort...');
            return;
        }

        console.log('Taking Picture...');
        NOTIFICATION_LED.high();

        camera.takePicture(function takePicture(err, image) {
            if (err) {
                console.log('error taking image', err);
            }

            NOTIFICATION_LED.low();

            var name = 'picture-' + new Date().getTime() + '.jpg';

            console.log('Saving picture as...', name, '...');
            process.sendfile(name, image);
            console.log('...done.');
        });

        setTimeout(function setSoundTrigger() {
            ambient.setSoundTrigger(SOUND_THRESHOLD);
        }, 1500);
    });
});

ambient.on('error', function (err) {
    console.log('Ambient Error: ');
    console.error(err);
});