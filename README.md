LiveRainMapper
==============
AngularJs + NodeJs app that use the twitter stream to visualize the current local weather conditions over a map using the OpenWeatherMap weather overlay.


Installation
=======================

1. Add your twitter API credentials on the app.js file.
2. Download Node dependencies: ```npm install```
3. Then the js needed: ```bower install```
4. You can start the server by simply doing: ```node app.js```
5. Express should be listening on the 3000 port so go to http://localhost:3000 to get started


Screenshot
=======================
![Map showing a storm front over Buenos Aires and a lot of people reporting it on twitter](https://raw.github.com/ravenlp/LiveRainMapper/master/screenshot.png "LiveRainMapper Screenshot")


To do
=======================
* Add I18N support
* Limit tweets to certain area
* Add UI capability to change tweets terms
* Add multi-client capability to the server

## License

```
LiveRainMapper:
    Copyright (c) 2013 Jorge Condomí

Leaflet library:
    Copyright (c) 2010-2013, Vladimir Agafonkin
    Copyright (c) 2010-2011, CloudMade
    All rights reserved.


Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```