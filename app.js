
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
//add test code in god YS's PC
// Session
var SessionMemory = require('connect-redis')(express);
var app = module.exports = express.createServer();



// test
// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
 
  app.use(express.bodyParser());
  app.use(express.cookieParser());  
  app.use(express.session({
  	secret: 'key',
  	maxAge : new Date(Date.now() + 3600000), //1hours (session's life time) _ (JH/120703) 
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
	if(req.session.user){
		next();
	}
	else{
		console.log('session no..');
		res.redirect('/');
	}
}

function requiresAdminLogin(req, res, next){
	if(req.session.user.role == 'admin'){
		next();
	}
	else if(req.session.user.Id == 'superadmin'){
		next();
	}
	else{
		console.log('session no..');
		res.redirect('/');
	}
}

function requiresSuperUserLogin(req, res, next){
	if(req.session.user.Id == 'superadmin'){
		next();
	}
	else{
		console.log('session no..');
		res.redirect('/admin');
	}
}

// Routes

app.get('/', routes.index);

app.get('/admin', routes.admin);
app.get('/admin/main', requiresSuperUserLogin, routes.adminView);
app.post('/admin/main', routes.adminCheck);
app.get('/admin/board_make_form', requiresSuperUserLogin, routes.board_make_form);
app.post('/admin/board_make', routes.makeBoard);

app.get('/admin/userlists', requiresAdminLogin, routes.userlistView);

// notify group
app.post('/admin/sendmailView', routes.sendmailView);	// mail writing form, called from "/admin/userlists"
app.post('/admin/sendmailAction', routes.sendmailAction);	// sending mail action, result alert page, called from "/admin/sendmailView"


app.get('/user_information', requiresAdminLogin, routes.user_information_view);
app.post('/user_information', requiresAdminLogin, routes.user_information_view);
app.post('/user_modify', requiresAdminLogin, routes.user_modify);

app.post('/join', routes.join);
app.post('/makeAccount', routes.makeaccount);

app.get('/board', requiresLogin ,routes.boardView);

app.get('/write', routes.write);
app.post('/board_write', routes.boardWrite);

app.get('/modify', routes.boardModify);
app.get('/board_modify', routes.boardModify);
app.post('/update', routes.boardUpdate);

app.get('/delete', routes.boardDelete);
app.get('/board_delete', routes.boardDelete);

app.post('/comment_write', routes.commentWrite);
app.get('/comment_delete', routes.commentDeleteForm);
app.post('/comment_delete', routes.commentDelete);


app.get('/sessions/new', routes.sessionNew);
app.post('/sessions', routes.session);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
