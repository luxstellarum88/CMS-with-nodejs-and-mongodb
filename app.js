/**
 * Module dependencies.
 */
var express = require('express')
  , fs = require('fs')
  , routes = require('./routes');
// Session
var SessionMemory = require('connect-redis')(express);
var app = module.exports = express.createServer();

// alert
var alert = require('./modules/alert/alert');

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
  	layout: false
  });
  
  app.use(express.bodyParser({uploadDir:'./public/uploads'}));
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
	if ( req.session.user) {
		next();
	}
	else {
		var alert_script = alert.makeAlert('권한이 없습니다.');
		res.render('alert', {
			title : 'Error',
			alert : alert_script
		});
	}
}

function requiresAdminLogin(req, res, next){
	if ( req.session.user.role == 'admin' ) {
		next();
	}
	else if ( req.session.user.Id == 'superadmin' ) {
		next();
	}
	else {
		var alert_script = alert.makeAlert('권한이 없습니다.');
		res.render('alert', {
			title : 'Error',
			alert : alert_script
		});
	}
}

function requiresSuperUserLogin(req, res, next){
	if ( req.session.user.Id == 'superadmin' ) {
		next();
	}
	else {
		var alert_script = alert.makeAlert('권한이 없습니다.');
		res.render('alert', {
			title : 'Error',
			alert : alert_script
		});
	}
}

// Routes

//--------------------------------------using
app.get('/', routes.index);

// HTML PAGE RENDERING PART

// Introduction
app.get('/sub01/sub01', routes.html_sub1_1); // OverView 
app.get('/sub01/sub02', routes.html_sub1_2); // Features
app.get('/sub01/sub03', routes.html_sub1_3); // Demos
app.get('/sub01/sub04', routes.html_sub1_4); // Licensing

// support
app.get('/sub02/sub01', routes.html_sub2_1); // 
app.get('/sub02/sub02', routes.html_sub2_2); // FAQ


// app.get('/sub03/sub01', routes.html_sub3_1);
// Community
app.get('/sub03/sub01', routes.html_sub3_1); // Freeboard
app.get('/sub03/sub02', routes.html_sub3_2); // Q&A
app.get('/sub03/sub03', routes.html_sub3_3); // User Tip & Knowhow


// Usage
app.get('/sub04/sub01', routes.html_sub4_1); // Installation
app.get('/sub04/sub02', routes.html_sub4_2); // User Manual
app.get('/sub04/sub03', routes.html_sub4_3); // Developer Manual


// Download
app.get('/sub05/sub01', routes.html_sub5_1); // SourceCode
app.get('/sub05/sub02', routes.html_sub5_2); // Plug-in
app.get('/sub05/sub03', routes.html_sub5_3); // Skin


app.post('/sessions', routes.session);

app.get('/admin/userlists/:page?', requiresAdminLogin, routes.user_list);
app.get('/user_information/:id', requiresAdminLogin, routes.user_information_view);
app.post('/user_modify', requiresAdminLogin, routes.user_modify);
// Ban user by the admin
app.get('/admin/deleteUser/:id', requiresAdminLogin, routes.delete_user);

app.get('/join', routes.join);

//join condition check
app.post('/check_id', routes.check_id);
app.post('/check_password', routes.check_password);
app.post('/check_name', routes.check_name);
app.post('/check_email', routes.check_email);


app.post('/makeAccount', routes.makeaccount);
app.post('/check_overlap', routes.check_overlap);
app.get('/logout', routes.logout);

app.get('/admin/board_modify/:id', requiresSuperUserLogin, routes.admin_board_modify_page);
app.post('/admin/board_update/:id', requiresSuperUserLogin, routes.admin_board_update);

app.get('/admin/board_recent_view', requiresAdminLogin, routes.board_recent_view);
app.get('/admin/recent_comment_view', requiresAdminLogin, routes.recent_comment_view);

app.get('/admin/board_modify/:id', requiresSuperUserLogin, routes.admin_board_modify_view);

app.post('/admin/main', routes.admin_check);
app.get('/admin/main', requiresSuperUserLogin, routes.admin_view);
app.get('/admin', routes.admin);

app.post('/admin/board_make', routes.make_board);
app.get('/admin/board_make_form', requiresSuperUserLogin, routes.board_make_form);

// notify group (e-mail, SMS)
app.post('/admin/sendmailView', routes.send_mail_view);	// mail writing form, called from "/admin/userlists"
app.post('/admin/sendmailAction', routes.send_mail_action);	// sending mail action, result alert page, called from "/admin/sendmailView"

app.get('/admin_new', routes.admin_new_index);
app.get('/admin_new/login', routes.admin_new_login);

app.get('/admin_new/common/footer', routes.admin_new_common_footer);
app.get('/admin_new/common/head', routes.admin_new_common_head);
app.get('/admin_new/common/header', routes.admin_new_common_header);
app.get('/admin_new/common/mainMenu', routes.admin_new_common_mainMenu);
app.get('/admin_new/common/subHead', routes.admin_new_common_subHead);

app.get('/admin_new/inc/leftMenu', routes.admin_new_inc_leftMenu);

app.get('/admin_new/sub01/sub01', routes.admin_new_sub1_1);
app.get('/admin_new/sub01/sub02', routes.admin_new_sub1_2);
app.get('/admin_new/sub02/sub01', routes.admin_new_sub2_1);

app.get('/write/:id', requiresLogin, routes.board_write_page);

app.get('/board/:id/:num([0-9]+)/:comm_page?', routes.board_contents);
app.get('/board/:id', routes.board_post_list);
app.post('/board_write', requiresLogin, routes.board_insert);
app.get('/board_modify/:id/:num', requiresLogin, routes.board_modify_page);
app.post('/board_modify_ajax', requiresLogin, routes.board_modify_ajax);
app.post('/update', requiresLogin, routes.board_update);
app.get('/board_delete/:id/:num', requiresLogin,routes.board_delete);
app.get('/board_main', requiresLogin ,routes.board_list_page);

app.post('/comment_write', requiresLogin, routes.comment_insert);

app.get('/comment_delete/:id/:num/:index', requiresLogin, routes.comment_delete);
app.get('/comment_update/:id/:num', requiresLogin, routes.comment_update);
app.post('/comment_check', requiresLogin, routes.comment_check_ajax);

//--------------------------------------using
app.post('/board_preview', routes.boardPreview);	// preview contents in a write mode. by Yoon-seop

app.post('/file_upload', function(req, res, next){
	
	var tmp_path = req.files.thumbnail.path;
	var target_path = __dirname +'/public/images/' + req.files.thumbnail.name;
	fs.rename(tmp_path, target_path, function(err){
		if(err) throw err;
		fs.unlink(tmp_path, function(){
			if(err) throw err;
			res.send('success');
		});
	});
});

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
