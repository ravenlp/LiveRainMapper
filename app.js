/**
 * Module dependencies.
 */
var express = require('express')
  , io = require('socket.io')
  , http = require('http')
  , twitter = require('ntwitter')
  , _ = require('underscore')
  , path = require('path')
  , cons = require('consolidate');

//Create an express app
var app = express();

//Create the HTTP server with the express app as an argument
var server = http.createServer(app);


// default twitter symbols array
var watchTerms = ['llueve', 'lloviendo', 'llovio', 'llovió', 'llovera', 'chaparron', 'viento', 'inundacion', 'agua', 'tormenta'];

// Geo fence
var geoFence = {
    north: -22.0008,
    south: -55.1124,
    west: -71.9436,
    east: -53.8381
};

var itIsRaining = true;


var tweets = [];

//Generic Express setup
app.set('port', process.env.PORT || 3000);

app.engine('html', cons.underscore);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

//We're using bower components so add it to the path to make things easier
app.use('/libs', express.static(path.join(__dirname, 'components')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Route needed to load partials
app.get('/partials/:filename', function(req, res){
    var filename = req.params.filename;
    if(!filename) return;  // might want to change this
    res.render("partials/" + filename, {});
});

app.get('/terms/:terms', function(req, res) {
    if(!_.isNull(currentTwitterStream)){
        currentTwitterStream.destroy();
    }
    itIsRaining = false;
    watchTerms = req.params.terms.split(',');
    initTwitterStream(watchTerms);
    res.render('index', {terms : watchTerms});

});

app.get('/', function(req, res) {
    if(!_.isNull(currentTwitterStream)){
        currentTwitterStream.destroy();
    }
    // Default terms to look for
    initTwitterStream(['llueve', 'lloviendo', 'llovio', 'llovió', 'tormenta', 'viento', 'chaparron']);
    res.render('index', {terms : null});
});

//Start a Socket.IO listen
var sockets = io.listen(server);

//If the client just connected, give them fresh data!
sockets.sockets .on('connection', function(socket) {
    socket.emit('data', tweets);
});

//Instantiate the twitter component
var t = new twitter({
    consumer_key: 'o9ifJf5orRUfCjulbHnrQ',
    consumer_secret: 'SCmydn8u4dq2kpYkhflkSI5coodJBxywR7lULw5UJrI',
    access_token_key: '1075261-XttD0ecjRekFgyIeJOdjSwLsGpXag7kDQea2Tf7FAM',
    access_token_secret: '7aLWdy088sLw4iv2otrb21Y1kuucKtIGVLgQc22NVnHtX'
});

var currentTwitterStream = null;

// Init the stream
function initTwitterStream (watchTerms){
    //Tell the twitter API to filter on the watchTerms
    t.stream('statuses/filter', { track: watchTerms }, function(stream) {
        currentTwitterStream = stream;
        //We have a connection. Now watch the 'data' event for incomming tweets.
        stream.on('data', function(tweet) {

            tweets = [];
            if(tweet.coordinates){
                tweets.push(tweet);
                sockets.sockets.emit('data', tweets);
            }
        });
        stream.on('destroy', function(response){
            tweets = [];
        });
    });
}


//Create the server
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
