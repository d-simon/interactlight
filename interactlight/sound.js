var midi = require('midi');

function Sound (opts) {
    this.midiPort = (opts) ? opts.midiPort || 0 : 0;
    this.midiTable = this.generateMidiTable();
    this.key = [0,2,4,5,7,9,11]; // C-Dur
    this.output = new midi.output();
    this.output.openPort(this.midiPort);
    console.log('Sound initiated with Midi: ' + this.output.getPortCount(), this.output.getPortName(this.midiPort));
}

Sound.prototype.sendMIDI = function (note, offDelay) {
    var delay = offDelay || 250
      , that = this;
    this.output.sendMessage([144, note, 100]);
    setTimeout(function () {
        that.output.sendMessage([128, note, 100]);
    }, delay);
};

Sound.prototype.generateMidiTable = function () {
    var returnA = [];
    for (var i = 0; i < 12; i++) {
        var array = [];
        for (var j = 0; j < 11; j++) {
            array.push(i + j*12);
        }
        returnA.push(array);
    }
    return returnA;
};

module.exports = Sound;