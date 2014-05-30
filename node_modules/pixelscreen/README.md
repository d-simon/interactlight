pixelscreen [![Code Climate](https://codeclimate.com/github/d-simon/node-pixelscreen.png)](https://codeclimate.com/github/d-simon/node-pixelscreen) [![Dependencies](https://david-dm.org/d-simon/node-pixelscreen.png)](https://david-dm.org/d-simon/node-pixelscreen)
===========

Create virtual screens and populate them with subscreens.

Supports Multi-Channel Pixels (RGB LED) Conversion to DMX.

Also allows to output the main screen to console.



## Install

    npm install pixelscreen

## Details

Let me illustrate the purpose of this library with this *beautiful* ASCI artwork:

     – – – – – – – – – – – – – – – – – – – – – – – – – – – – –
    |                                                         |
    |                       PixelScreen                       |
    |                                                         |
    | – – – – – – – – – – – – – –  – – – – – – – – – – – – –  |
    ||                           ||                          ||
    ||                           ||                          ||
    ||         Screen #1         ||        Screen #2         ||
    ||                           ||                          ||
    ||                           ||                          ||
    | – – – – – – – – – – – – – –  – – – – – – – – – – – – –  |
    |                                                         |
     – – – – – – – – – – – – – – – – – – – – – – – – – – – – –

Like with the screens  **1 & 2**, you can simply use Pixelscreen to divide an incoming picture into multiple **SubScreens** which will then each receive their respectively subscribed area.

     – – – – – – – – – – – – – – – – – – – – – – – – – – – – –
    |                                                         |
    |                              – – – – – – – – – –        |
    |                             |                   |       |
    |          – – – – – – – – – –|– –                |       |
    |         |                   |   |               |       |
    |         |                   |   | Screen #4     |       |
    |         |                   |   |               |       |
    |         |       Screen #3   |   |               |       |
    |         |                   |   |               |       |
    |         |                    – – – – – – – – – –        |
    |         |                       |                       |
    |          – – – – – – – – – – – –                        |
    |                                                         |
     – – – – – – – – – – – – – – – – – – – – – – – – – – – – –

Also, the Screens **3 & 4** illustratethere is no limitation as to overlapping or multiple screens listening to the same area.

     – – – – – – – – – – – – – – – – – – – – – – – – – – – – –
    |                                                         |
    |   Heck, even out of bounds will work!                   |
    |                                                         |
    |          – – – – – – – – – – – –                        |
    |         |                       |                       |
    |         |                       |                       |
    |         |                       |                       |
    |         |       Screen #5       |                       |
    |         |                       |                       |
     – – – – –|– – – – – – – – – – – –|– – – – – – – – – – – –
              |                       |
               – – – – – – – – – – – –
