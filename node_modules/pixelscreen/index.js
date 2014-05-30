var TerminalScreen = require('terminal-pixelscreen')
  , _ = require('lodash')
  , extend = require('extend');

function SubScreen (name, options, callback) {
    var opts = extend({
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        channels: 3,
        dmx: false
    },options);
    this.name = name;
    this.x = opts.x;
    this.y = opts.y;
    this.width = opts.width;
    this.height = opts.height;
    this.channels = opts.channels;
    this.dmx = opts.dmx;
    this.callback = callback;
    this.image = createImageArray(this.width, this.height, this.channels);
}

function createImageArray (width, height, channels) {
    var array = [];
    for (var i = 0; i < height; i++) {
        array.push([]);
        for (var j = 0; j < width; j++) {
            array[i].push([]);
            for (var k = 0; k < channels; k++) {
                array[i][j].push(0);
            }
        }
    }
    return array;
}

function PixelScreen (options) {
    var opts = extend({
        width: 1,
        height: 1,
        channels: 3,
        displayScreen: false
    }, options);
    this.width = opts.width;
    this.height = opts.height;
    this.channels = opts.channels;
    this.image = createImageArray(this.width, this.height, this.channels);
    this.screens = [];
    this.displayScreen = opts.displayScreen;
    this.terminalScreen = new TerminalScreen(this.width,this.height,0);
}

PixelScreen.prototype.registerScreen = function (name, options, callback) {
    if (!name || this.screens[name]) throw new Error('Screen "' + name + '" already exists!');
    this.screens[name] = new SubScreen(name, options, callback);
    return this;
};

PixelScreen.prototype.unregisterScreen = function (name) {
    if (!name || !this.screens[name]) throw new Error('Screen "' + name + '" doesn\'t exist!');
    this.screen[name] = null;
    return this;
};

PixelScreen.prototype.forceUpdate = function () {
    for (var screenName in this.screens) {
        var screen = this.screens[screenName]
          , pixelImage = this.getImage(screen.name);
        if(screen.dmx === true) pixelImage = this.arrayToDMX(pixelImage);
        screen.callback(null, pixelImage);
    }
    if (this.displayScreen === true) {
        this.terminalScreen.update(this.image);
        this.terminalScreen.paint();
    }
    return this;
};

PixelScreen.prototype.update = function (input) {
    if (!input || !input.length) throw new Error('No input!');
    if (input[0][0].length !== this.channels) throw new Error('Invalid no. of channels!');
    if (input.length !== this.height ||
        input[0].length !== this.width) throw new Error('Invalid dimensions! (' + input[0].length + 'x' + input.length +
                                                        ' instead of ' + this.width + 'x' + this.height + ')');

    this.image = _.cloneDeep(input);
    this.forceUpdate();
    return this;
};

PixelScreen.prototype.getImage = function (name) {
    if (!name) return this.image;
    if (!this.screens[name]) return;

    var screen = this.screens[name]
      , image = [];

    for (var i = 0; i < screen.height; i++) {
        image.push([]);
        for (var j = 0; j < screen.width; j++) {

            if ( // out of bound ranges ranges
                i + screen.y < 0 ||
                j + screen.x < 0 ||
                i + screen.y > this.image.length ||
                j + screen.x > this.image[i+screen.y].length
            ) {
                // return flat channels ([0,...,0])
                image[i].push(this.enerateArray(3,0));
            } else {
                image[i].push(this.createBalancedChannels(this.image[i+screen.y][j+screen.x], 3));
            }
        }
    }

    return image;
};

PixelScreen.prototype.createBalancedChannels = function (inputArray, expectedChannels) {
    // return channels and flatten or cut channels
    // if we have a difference in no. of channels
    var array = [];
    for (var k = 0; k < inputArray.length; k++) {
        if (k < expectedChannels) {
            array.push(inputArray[k]);
        } else {
            array.push(0);
        }
    }
    // fill up with flat channels if we are missing channels
    if (array.length < expectedChannels) {
        for (var k = array.length; k < expectedChannels; k++) {
            array.push(0);
        }
    }
    return array;
};

PixelScreen.prototype.generateArray = function (length, value) {
    var array = [];
    for (var i = 0; i < length; i++) {
        array.push(value);
    }
    return array;
};

PixelScreen.prototype.arrayToDMX = function (input) {
    var dmx = [];
    for (var i = 0; i < input.length; i++) {
        for (var j = 0; j < input[i].length; j++) {
            for (var k = 0; k < input[i][j].length; k++) {
                dmx.push(input[i][j][k]);
            }
        }
    }
    return dmx;
};

module.exports = PixelScreen;