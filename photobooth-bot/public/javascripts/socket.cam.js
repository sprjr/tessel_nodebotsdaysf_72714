// do stuff with the images from the sound-cam
// transmitted over sockets

var socket = io();

socket.on('photo-event', function (photoEvent) {
    $('#photos .display').append('<img src="images/'+photoEvent.photo+'" width="128" />')
});

socket.on('tessel-failure', function (msg) {
    $('#photos h2').text('The tessel has failed. Try refreshing');

    setTimeout(window.locatation.reload, 10000);
});

socket.on('sound-polling', function (soundEvent) {
    console.log(soundEvent);
    $('#noise').text(soundEvent.sound);
    $('#threshold').text(soundEvent.threshold);
});