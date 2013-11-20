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
var watchSymbols = ['$vz', '$xom', '$cvx', '$ge', '$ko', 'llueve'];

//This structure will keep the total number of tweets received and a map of all the symbols and how many tweets received of that symbol
var watchList = {
    total: 0,
    symbols: {},
    tweets: []
};

//Set the watch symbols to zero.
_.each(watchSymbols, function(v) { watchList.symbols[v] = 0; });

//Generic Express setup
app.set('port', process.env.PORT || 3000);

app.engine('html', cons.mustache);
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
    res.render("partials/" + filename );
});

app.get('/', function(req, res) {
    res.render('index', { data: watchList });
});

//Start a Socket.IO listen
var sockets = io.listen(server);

//Set the sockets.io configuration.
//THIS IS NECESSARY ONLY FOR HEROKU!
sockets.configure(function() {
  sockets.set('transports', ['xhr-polling']);
  sockets.set('polling duration', 10);
});

//Create the server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
