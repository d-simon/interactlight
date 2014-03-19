var i2p = require('image2pixels')
  , actor = require('./omc-dmx.js')
  , omc = actor.omc
  , dmx = actor.dmx;

var filename = '../video/hoi_text/hoi_text0045.jpg';

i2p(filename, function (err, pixels) {
    console.log(pixels);
});