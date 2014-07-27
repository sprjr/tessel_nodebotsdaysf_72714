// nodebotsdaysf
// http://start.tessel.io/modules/ambient

var tessel      = require('tessel'),
    ambientlib  = require('ambient-attx4');

var ambient     = ambientlib.use(tessel.port('D'));

ambient.on('ready', function () {
    setInterval( function () {
        ambient.getLightLevel( function (err, ldata) {
            console.log("Light level:", ldata.toFixed(8));
        });

        ambient.getSoundLevel( function (err, sdata) {
            console.log("Sound level:", sdata.toFixed(8));
        });

        console.log('=========================');
    }, 1000);

    ambient.setLightTrigger(0.01);

    ambient.on('light-trigger', function (data) {
        console.log('Our light trigger was hit:', data);
        ambient.clearLightTrigger();

        setTimeout( function () {
            ambient.setLightTrigger(0.01);
        }, 1500);
    });

    ambient.setSoundTrigger(0.01);

    ambient.on('sound-trigger', function (data) {
        console.log('Our sound trigger was hit:', data);
        ambient.clearSoundTrigger();

        setTimeout( function () {
            ambient.setSoundTrigger(0.01);
        }, 1500);
    });
});

ambient.on('error', function (err)  {
    console.log(err);
});
