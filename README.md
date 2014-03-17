dmx-experiments
===============

This is a repository for the experiments conducted during the course "Farbe, Licht, Interaktion" at ZHdK 2014.

The code is currently (17.03.14) in **very unorganized** state. This is *work in progress.* The plan is to split up functionality into separate libraries and provide a clean set of repositories/plugins, plus a collective repository for our usage examples.

###Dependencies

[1][Node.js]

If you intend to connect through DMX directly from your machine (instead of sending it through Artnet)then you'll need the **FTDI Drivers** + **libftdi** (Install the later one with Homebrew or Macports)


###TODO

 - Libraries
   - Interface to 12x12 DMX Screens / A general library to utilize and arrange pixel screens with DMX
   - Abstract (Combine) the **DMX <-> Artnet** interaction
   - Provide an easy conversion between Single Channel LED vs. 3-Channel RGB LED
 - Clean up the so far created examples
 - Make everything D.R.Y
 - Web Interface(s)
 - Provide examples for all of the above

    [1] http://www.nodejs.org