
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');


// Session
var SessionMemory = require('connect-redis')(express);
var app = module.exports = express.createServer();


// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
 
  app.use(express.bodyParser());
  app.use(express.cookieParser());  
  app.use(express.session({
  	secret: 'key',
  	store: new SessionMemory
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// sessions check
function requiresLogin(req, res, next){
	console.log('requiresLogin : ' + req.session.user_id);

	if(req.session.user_id){
		console.log('session ok');
		next();
	}
	else{
		console.log('session no..');
		res.redirect('/');
	}
}

function requiresAdminLogin(req, res, next){
	console.log('requiresLogin : ' + req.session.user_id);

	if(req.session.user_id == 'adminid'){
		console.log('session ok');
		next();
	}
	else{
		console.log('session no..');
		res.redirect('/');
	}
}
// Routes

app.get('/', routes.index);

app.get('/admin', routes.admin);
app.get('/admin/userlists', requiresAdminLogin, routes.userlistView);

app.post('/join', routes.join);
app.post('/makeAccount', routes.makeaccount);

app.get('/board', requiresLogin ,routes.boardView);
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
