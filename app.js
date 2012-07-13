
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

// Session
var SessionMemory = require('connect-redis')(express);
var app = module.exports = express.createServer();

// alert
var alert = require('./alert/alert');

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
		var alert_script = alert.makeAlert('권한이 없습니다.');
		res.render('alert', {
			title : 'Error',
			alert : alert_script
		});
	}
}

function requiresSuperUserLogin(req, res, next){
	if(req.session.user.Id == 'superadmin'){
		next();
	}
	else{
		var alert_script = alert.makeAlert('권한이 없습니다.');
		res.render('alert', {
			title : 'Error',
			alert : alert_script
		});
	}
}

// Routes

app.get('/', routes.index);

app.get('/admin', routes.admin);
app.get('/admin/main', requiresSuperUserLogin, routes.adminView);
app.post('/admin/main', routes.adminCheck);
app.get('/admin/board_make_form', requiresSuperUserLogin, routes.board_make_form);
app.post('/admin/board_make', routes.makeBoard);
app.get('/admin/board_recent_view', requiresAdminLogin, routes.board_recent_view);
app.get('/admin/recent_comment_view', requiresAdminLogin, routes.recent_comment_view);

app.get('/admin/write_notice', requiresAdminLogin, routes.write_notice);
app.post('/admin/insert_notice', requiresAdminLogin, routes.insert_notice);
app.get('/admin/notice', requiresLogin, routes.show_notice);
app.get('/admin/notice_delete', requiresAdminLogin, routes.notice_delete);
app.get('/admin/notice_modify', requiresAdminLogin, routes.notice_modify_view);
app.post('/admin/notice_update', requiresAdminLogin, routes.notice_update);

app.get('/admin/userlists', requiresAdminLogin, routes.userlistView);

// notify group (e-mail, SMS)
app.post('/admin/sendmailView', routes.sendmailView);	// mail writing form, called from "/admin/userlists"
app.post('/admin/sendmailAction', routes.sendmailAction);	// sending mail action, result alert page, called from "/admin/sendmailView"
// Ban user by the admin
app.get('/admin/deleteUser', requiresAdminLogin, routes.deleteUser);

app.get('/user_information', requiresAdminLogin, routes.user_information_view);
app.post('/user_information', requiresAdminLogin, routes.user_information_view);
app.post('/user_modify', requiresAdminLogin, routes.user_modify);

app.post('/join', routes.join);
app.post('/makeAccount', routes.makeaccount);
app.get('/logout', routes.logout);

app.get('/board_main', requiresLogin ,routes.boardMain);
app.get('/board', requiresLogin ,routes.boardView);

app.get('/write', routes.write);
app.post('/board_write', routes.boardWrite);

app.get('/board_modify', routes.boardModify);
app.post('/update', routes.boardUpdate);

app.get('/board_delete', routes.boardDelete);

app.post('/comment_write', routes.commentWrite);
app.get('/comment_delete', routes.commentDeleteForm);
app.post('/comment_delete', routes.commentDelete);


app.get('/sessions/new', routes.sessionNew);
app.post('/sessions', routes.session);

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
