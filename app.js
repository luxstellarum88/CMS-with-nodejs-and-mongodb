
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Session
var SessionMemory = require('./node_modules/express/node_modules/connect/lib/middleware/session/memory');

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
 
  app.dynamicHelpers(
  	{
  		session: function(req, res){
  			return req.session;
  		}
  	}
  );
 
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
  app.use(express.cookieParser());
  app.use(express.session({
  	secret: 'key',
  	store: new SessionMemory( {
  		reapInterval: 60000 * 10
  	}) 
  }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// sessions check
function requiresLogin(req, res, next){
	if(req.session){
		next();
	}
	else{
		res.redirect('/sessions/new?redir=' + req.url);
	}
}


// Routes

app.get('/', routes.index);
app.get('/board', routes.boardView);
app.get('/board/:id', routes.boardIdView);

app.get('/write', routes.write);
app.post('/board_write', routes.boardWrite);

app.get('/modify', routes.boardModify);
app.post('/update', routes.boardUpdate);

app.get('/delete', routes.boardDelete);

app.get('/sessions/new', routes.sessionNew);
app.post('/sessions', routes.session);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
