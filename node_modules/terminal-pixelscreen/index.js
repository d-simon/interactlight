var clear = require('clear')
  , ansi = require('ansi')
  , cursor = ansi(process.stdout);

function Screen (width, height, spacing) {
    this.width = width || 40;
    this.height = height || 24;
    this.spacing = spacing || 0;
    this.image = this.generateScreen();
};

Screen.prototype.Pixel = function (r, g, b) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
};

Screen.prototype.generateScreen = function () {
    var screenArray = [];
    for (var i = 0; i < this.height; i++) {
        screenArray.push([]);
        for (var j = 0; j < this.width; j++) {
            screenArray[i].push(new this.Pixel());
        }
    }
    return screenArray;
};

Screen.prototype.update = function (array) {
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            this.image[i][j] = new this.Pixel(array[i][j][0], array[i][j][1], array[i][j][2]);
        }
    }
};

Screen.prototype.updateFromDMXUniverse = function (obj, ledChannels) {
    var ledChannels = ledChannels || 3;
    for (channel in obj) {
        var channel = ~~channel
          , slot = ~~(channel / ledChannels)
          , y = ~~(slot / this.width)
          , x = slot % this.width
          , led = channel % ledChannels;

        if (ledChannels !== 1) {
            // Three channels per pixel
            switch (led) {
                case 0:
                    this.image[y][x].r = obj[channel];
                    break;
                case 1:
                    this.image[y][x].g = obj[channel];
                    break;
                case 2:
                    this.image[y][x].b = obj[channel];
                    break;
                default:
                    break;
            }
        } else {
            // Single channel pixel
            this.image[y][x].r = obj[channel]
            this.image[y][x].g = obj[channel]
            this.image[y][x].b = obj[channel]
        }

    };
};

Screen.prototype.paint = function () {
    clear();
    var paint = [];
    for (var i = 0; i < this.image.length; i++) {
        for (var j = 0; j < this.image[i].length; j++) {
            cursor.reset()
                .write(repeatStr('  ', this.spacing))
                .bg.rgb(this.image[i][j].r, this.image[i][j].g, this.image[i][j].b)
                .write('  ');
        }
        cursor.reset().write('\n'+repeatStr('\n', this.spacing));
    }
};

function repeatStr (str, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 0) {
        if (count & 1) result += str;
        count >>= 1, str += str;
    }
    return result;
};

module.exports = Screen;