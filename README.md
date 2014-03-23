InteractLight
=============


This is the code repository the installation produced and the experiments conducted during the course "Farbe, Licht, Interaktion" at [ZHdK](http://www.zhdk.ch) during the time of 10.03.14-19.03.14

[![Code Climate](https://codeclimate.com/github/d-simon/interactlight.png)](https://codeclimate.com/github/d-simon/interactlight)

##Overview
- `server-interact-light.js` is the main entry point for the installation.


- `interactlight/` major components relevant to **server-interact-light.js**
- `lib/` independet reuseable components (i.e. snake logic)
- `media/` media (i.e. pixelimages)
- `loops/` examples of "video streams" / image sequences
- `old/` this is where all experimental samples are located. The code here is very unorganized and not DRY.

###To Do

~~The code is currently (17.03.14) in *very unorganized* state. This is *work in progress.*~~ The plan is to split up functionality into separate libraries and provide a clean set of repositories/plugins, plus a collective repository for our usage examples.

 - ~~Libraries~~ **See [pixelscreen](https://github.com/d-simon/node-pixelscreen) and [image2pixels](https://github.com/d-simon/node-image2pixels)**
   - ~~Interface to 12x12 DMX Screens / A general library to utilize and arrange pixel screens with DMX~~
   - ~~Abstract (Combine) the **DMX <-> Artnet** interaction~~
   - ~~Provide an easy conversion between Single Channel LED vs. 3-Channel RGB LED~~
 - ~~Make everything D.R.Y~~
 - ~~Clean up the so far created examples~~ Create beginner friendly examples
 - Web Interface(s)

###Dependencies

- [Node.js](http://www.nodejs.org/)
- If you intend to connect through DMX directly from your machine (instead of sending it through Artnet)then you'll need the **FTDI Drivers** + **libftdi** (Install the later one with Homebrew or Macports)

###Installation

Run `npm install` to load all package dependencies

