/**
 * Module dependencies.
 */
var express = require('express')
  , io = require('socket.io')
  , http = require('http')
  , twitter = require('ntwitter')
  , cronJob = require('cron').CronJob
  , _ = require('underscore')
  , path = require('path')
  , cons = require('consolidate');

//Create an express app
var app = express();

//Create the HTTP server with the express app as an argument
var server = http.createServer(app);


// Twitter symbols array
var watchTerms = ['llueve', 'lloviendo', 'llovio', 'llovió', 'LaVidaMeEnseño', 'wanda'];

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

app.get('/partials/:filename', function(req, res){
    var filename = req.params.filename;
    if(!filename) return;  // might want to change this
    res.render("partials/" + filename, {});
});

app.get('/', function(req, res) {
    res.render('index', {});
});

//Start a Socket.IO listen
var sockets = io.listen(server);



//Set the sockets.io configuration.
//THIS IS NECESSARY ONLY FOR HEROKU!
sockets.configure(function() {
    sockets.set('transports', ['xhr-polling']);
    sockets.set('polling duration', 10);
});

//If the client just connected, give them fresh data!
sockets.sockets.on('connection', function(socket) {
    socket.emit('data', tweets);
});

//Instantiate the twitter component
var t = new twitter({
    consumer_key: 'o9ifJf5orRUfCjulbHnrQ',
    consumer_secret: 'SCmydn8u4dq2kpYkhflkSI5coodJBxywR7lULw5UJrI',
    access_token_key: '1075261-XttD0ecjRekFgyIeJOdjSwLsGpXag7kDQea2Tf7FAM',
    access_token_secret: '7aLWdy088sLw4iv2otrb21Y1kuucKtIGVLgQc22NVnHtX'
});



// //Tell the twitter API to filter on the watchTerms
t.stream('statuses/filter', { track: watchTerms }, function(stream) {

    //We have a connection. Now watch the 'data' event for incomming tweets.
    stream.on('data', function(tweet) {
        tweets = [];
        if(tweet.coordinates){
            tweets.push(tweet);
            sockets.sockets.emit('data', tweets);
        }

    });
});

//Reset everything on a new day!
//We don't want to keep data around from the previous day so reset everything.
new cronJob('0 0 0 * * *', function(){
    //Reset the total
    //watchList.total = 0;

    //Clear out everything in the map
    //_.each(watchTerms, function(v) { watchList.symbols[v] = 0; });

    //Send the update to the clients
    //sockets.sockets.emit('data', watchList);
}, null, true);

//Create the server
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
