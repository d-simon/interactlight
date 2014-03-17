var twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: 'hJX4AUlpQQPLzxSlJrupBQ',
    consumer_secret: 'H2KEcT40VKSDcj7kfbGIxEdOBsgbG798bwSAl8ClEmQ',
    access_token_key: '327060292-mGH02XJ4vu6kslc7FYxBtz6sxyXnKr9ypMj9RGqM',
    access_token_secret: '5jn9fdIlYGwVXIeNtnZDuB0OkW6id73gPR516DYfyP7R4'
});

var DMX = require('dmx')
  , dmx = new DMX()
  , animation = new DMX.Animation();

dmx.addUniverse(0, 'enttec-usb-dmx-pro', 0);

dmx.update(0, {
    // Strip 1 to white
    0: 255,
    1: 255,
    2: 255,
    // Strip 2 to white
    3: 255,
    4: 255,
    5: 255
});

function reduceUntilZero (inputVal) {
    return (inputVal > 4) ? inputVal - 4 : 0;
}
setInterval(function () {
    dmx.update(0, {
        // Strip 1 to white
        0: reduceUntilZero(dmx.universes[0].get(0)),
        1: reduceUntilZero(dmx.universes[0].get(1)),
        2: reduceUntilZero(dmx.universes[0].get(2)),
        // Strip 2 to white
        3: reduceUntilZero(dmx.universes[0].get(3)),
        4: reduceUntilZero(dmx.universes[0].get(4)),
        5: reduceUntilZero(dmx.universes[0].get(5))
    });
},33);

twit.stream('statuses/filter', {track: ['ukraine' , 'obama ukraine', 'krim obama', 'obama']}, function(stream) {
    stream.on('data', function(data) {
        if (data) console.log('ukraine', data.text.replace(/(\r\n|\n|\r)/gm,""));
        dmx.update(0, {
            // Strip 1 to white
            0: dmx.universes[0].get(0),
            1: dmx.universes[0].get(1)+20,
            2: dmx.universes[0].get(2),
        });
    });
    stream.on('limit', function(data) {
        console.log(data);
    });
});

twit.stream('statuses/filter', {track: ['russia', 'putin ukraine', 'krim putin', 'putin']}, function(stream) {
    stream.on('data', function(data) {
        if (data) console.log('russia ', data.text.replace(/(\r\n|\n|\r)/gm,""));
        dmx.update(0, {
            // Strip 1 to white
            3: dmx.universes[0].get(3)+20,
            4: dmx.universes[0].get(4),
            5: dmx.universes[0].get(5),
        });
    });
    stream.on('limit', function(data) {
        console.log(data);
    });
});