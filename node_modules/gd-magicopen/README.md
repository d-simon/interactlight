node-gd-magicopen
=================

Opens an image in node-gd based on its MIME type

Usage
=====

    var mopen = require('gd-magicopen');

    mopen('threewolfmoon.jpg', function(err, image){
        //Handle image as a node-gd image object
    });
