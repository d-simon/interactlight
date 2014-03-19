var config = require('./config.js');
var twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

var DMX = require('dmx')
  , dmx = new DMX()
  , dmx2 = new DMX()
  , A = DMX.Animation;

dmx.addUniverse(0, 'null', 0);
dmx2.addUniverse(0, 'null', 1);

var Artnet = require('artnet-node'),
    omc1 = Artnet.Client.createClient('10.0.12.201', 6454),
    omc2 = Artnet.Client.createClient('10.0.12.202', 6454);

var VirtualScreen = require('./lib/virtualscreen')
  , screenWidth = 24
  , screenHeight = 12
    virtualScreen = new VirtualScreen(screenWidth,screenHeight,1);

function reduceUntilZero (inputVal, n) {
    var n = n || 1;
    return (inputVal > n) ? inputVal - n : 0;
}
function increaseUntil (inputVal, max, n) {
    var n = n || 1;
    return (inputVal < max) ? inputVal + n : max;
}
function reduceUntil (inputVal, min, n) {
    var min = min || 50;
    var n = n || 1;
    return (inputVal > min) ? inputVal - n : min;
}

var reduceInterval =  setInterval(function () {
    var obj = {};
    var obj2 = {};

    for (var i = 0; i < screenHeight; i++) {
        for (var j = 0; j < screenWidth/2; j++) {
            obj[(i*screenWidth/2+j)*3+0] = increaseUntil(dmx.universes[0].get((i*screenWidth/2+j)*3+0),80,5);
            obj[(i*screenWidth/2+j)*3+1] = increaseUntil(dmx.universes[0].get((i*screenWidth/2+j)*3+1),80,5);
            obj[(i*screenWidth/2+j)*3+2] = increaseUntil(dmx.universes[0].get((i*screenWidth/2+j)*3+2),80,5);
        }
    }
    for (var i = 0; i < screenHeight; i++) {
        for (var j = 0; j < screenWidth/2; j++) {
            obj2[(i*screenWidth/2+j)*3+0] = increaseUntil(dmx2.universes[0].get((i*screenWidth/2+j)*3+0),80,5);
            obj2[(i*screenWidth/2+j)*3+1] = increaseUntil(dmx2.universes[0].get((i*screenWidth/2+j)*3+1),80,5);
            obj2[(i*screenWidth/2+j)*3+2] = increaseUntil(dmx2.universes[0].get((i*screenWidth/2+j)*3+2),80,5);
        }
    }
    dmx.update(0, obj);
    dmx2.update(0, obj2);
    omc1.send(dmx.universes[0].universe.toJSON());
    omc2.send(dmx2.universes[0].universe.toJSON());
    virtualScreen.updateDMX(0, obj);
}, 33);

var coordinates = [
    //-74,40,-73,41
    -180,-90,180,90
]

twit.stream('statuses/filter', {filter_level:'none', locations:coordinates.join(',')/*'-180,-90,180,90'*/}, function(stream) {
    stream.on('data', function(data) {

        var array = [],
            obj = {},
            obj2 = {};

        if (data.geo) {
            array.push({
                x: ~~((data.geo.coordinates[1] + 180) / 360 * screenWidth),
                y: screenHeight - ~~((data.geo.coordinates[0] + 90) / 180 * screenHeight),
                // x: ~~(((data.geo.coordinates[1] + 180) / 360 * (Math.abs(coordinates[2]-coordinates[0]))/360) * screenWidth),
                // y: screenHeight - ~~(((data.geo.coordinates[0] + 90) / 180 * (Math.abs(coordinates[3]-coordinates[1]))/360) * screenHeight),

                r: 10,
                g: 10,
                b: 255
            });
            if (array[0].x < 12) {
                var led = array[0].y*screenWidth/2+array[0].x;
                obj[led*3+0] = Math.min(dmx.universes[0].get(led*3+0) + 5, 10);
                obj[led*3+1] = Math.min(dmx.universes[0].get(led*3+1) + 5, 10);
                obj[led*3+2] = Math.min(dmx.universes[0].get(led*3+2) + 5, 10);

            } else {
                var led = array[0].y*screenWidth/2+array[0].x-12;
                obj2[led*3+0] = Math.min(dmx2.universes[0].get(led*3+0) + 5, 10);
                obj2[led*3+1] = Math.min(dmx2.universes[0].get(led*3+1) + 5, 10);
                obj2[led*3+2] = Math.min(dmx2.universes[0].get(led*3+2) + 5, 10);
            }
        }
        virtualScreen.update(array);
        dmx.update(0, obj);
        dmx2.update(0, obj2);
        omc1.send(dmx.universes[0].universe.toJSON());
        omc2.send(dmx2.universes[0].universe.toJSON());


    });
    stream.on('error', function (method, code) {
        console.log(arguments);
    })
});

setInterval(function (argument) {
    virtualScreen.paint();
}, 1330);

