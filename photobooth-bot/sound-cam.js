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
    process.stdout.write('Connected to Camera Module...');
});

camera.on('err', function (err) {
    CAMERA_READY = false;
    process.stdout.write('Camera Error, Feature Unavailable');
    console.error(err);
    process.exit(0);
});

// Listen For Sound Command
ambient.on('ready', function ambientReady () {
    process.stdout.write('Connected to Ambient Module...');

    setInterval( function ambientPolling () {
        ambient.getSoundLevel( function getAmbientSoundLevel (err, sdata) {
            process.stdout.write("sound," + sdata.toFixed(8) + ',' + SOUND_THRESHOLD);
        });
    }, 1000);

    ambient.setSoundTrigger(SOUND_THRESHOLD);

    ambient.on('sound-trigger', function soundTrigger(data) {
        process.stdout.write('sound,' + data + ',' + SOUND_THRESHOLD);
        ambient.clearSoundTrigger();

        if (!CAMERA_READY) {
            process.stdout.write('Camera is not ready for photography, abort...');
            return;
        }

        NOTIFICATION_LED.high();

        camera.takePicture(function takePicture(err, image) {
            process.stdout.write('Taking Picture...');
            NOTIFICATION_LED.low();
            if (err) {
                process.stdout.write('error taking image', err);
                return;
            }

            var name = 'picture-' + new Date().getTime() + '.jpg';

            // process.stdout.write('Saving picture as...', name, '...');
            process.sendfile(name, image);
            // process.stdout.write('...done.');
        });

        setTimeout(function setSoundTrigger() {
            ambient.setSoundTrigger(SOUND_THRESHOLD);
        }, 1500);
    });
});

ambient.on('error', function (err) {
    process.stdout.write('Ambient Error: ');
    process.stdout.write(err);
    process.exit(0);
});