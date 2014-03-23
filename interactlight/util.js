module.exports.convertI2PtoPixelScreen = function (input) {
    var output = [];
    for (var i = 0; i < input.length; i++) {
        output.push([]);
        for (var j = 0; j < input[i].length; j++) {
            output[i].push([
                input[i][j].red,
                input[i][j].green,
                input[i][j].blue
            ]);
        }
    }
    return output;
};
