var adminCheck = require('../admin/admin_check');
var boardMake = require('../admin/makeBoard');

var notice = require('../admin/notice_board');
var notify = require('../admin/notify');			// e-mail, SMS..
var recent_comment = require('../admin/recent_comment');

var alert = require('../alert/alert')

var users = require('../account/users');
var userMake = require('../account/makeaccount');
var deleteUserService = require('../admin/delete_user.js'); // Ban user

var commDelete = require('../board/comment/comment_delete');

/*
	2012. 07. 13. by JH
*/
var board_list = require('../admin/board_list');
var board_main = require('../board/list');
var board_view = require('../board/view');
var board_write = require('../board/write');
var board_show = require('../board/show_contents');
var board_modify = require('../board/modify');
var board_delete = require('../board/delete');

var board_recent_doc = require('../admin/board_recent_doc');

var comment_write = require('../board/comment/write');

exports.index = function(req, res){
	//세션이 있을 경우 board페이지로 바로 넘어가도록 변경
	if(req.session.user) {
		res.redirect('/board_main');
	}
	else{
  		res.render('index', { title: 'Express' });
 	}
};

exports.admin = function(req, res){
	//세션이 있을 경우 board페이지로 바로 넘어가도록 변경
	if(req.session.user) {
		if(req.session.user.Id === 'superadmin') {
			res.redirect('/admin/main');
		}
		else{
	  		res.render('admin', { title: 'admin' });
	 	}
 	}
 	else{
	  		res.render('admin', { title: 'admin' });
	 }	
}

exports.boardMain = function(req, res){
	board_main.list(req, res);
}//end of boardMain

exports.board_make_form = function(req, res){
	res.render('admin/board_make_form', {
		title: 'board_make_form'
	});
}

exports.write = function(req, res){
	var auth = 'guest';
	
	if('admin' === req.session.user.role || 'superadmin' === req.session.user.Id) {
		auth = 'admin';
	}
	
	res.render('board/write', {
		title: 'write'
		, id : req.query.id
		, auth : auth
	});
}

exports.boardWrite = function(req, res){
	if( (""!=req.body.subject) && (""!=req.body.name) && (""!=req.body.memo) ) {
		board_write.insert(req, res);
	}
	else {
		var alert_script = alert.makeAlert('비어있는 항목이 있습니다.');
		res.render('alert', {
			title : 'Error',
			alert : alert_script
		}) ;
	}
}

exports.boardView = function(req, res){	
	if(!req.query.num){
		// /board?id=*&page=*		
		board_view.post(req, res);
	}
	else{
		// /board?id=*&num=*
		board_show.contents(req, res);
	}
}

exports.boardModify = function(req, res){
	board_modify.show(req, res);	
}

exports.boardUpdate = function(req, res){
	if( (""!=req.body.subject) && (""!=req.body.memoForm) ) {
		board_modify.update(req, res);
	}
	else {
		var alert_script = alert.makeAlert('비어있는 항목이 있습니다.');
		res.render('alert', {
			title : 'Error',
			alert : alert_script
		}) ;
	}
}

exports.boardDelete = function(req, res){
	board_delete.del(req, res);
}

exports.logout = function(req, res) {
	if(req.session.user) {
		req.session.user = "";
		res.redirect('/');
	}
}

exports.commentWrite = function(req, res){
	comment_write.insert(req, res);
}


exports.recent_comment_view = function(req, res) {
	recent_comment.view(req, res);
}


exports.board_recent_view = function(req, res) {
	board_recent_doc.show(req, res);
}


//------------------------------------------------------수정완료

exports.userlistView = function(req, res){
	users.allUser(req, res);
}

exports.user_information_view = function(req, res){
	users.user_information(req.query.id, res);
}


exports.user_modify = function(req, res){
	users.user_modify(req.body, res);
}


exports.join = function(req, res){
	res.render('join', {title: 'Join'});
};


exports.makeaccount = function(req, res){
	userMake.insertUser(req, res);
}

exports.boardIdView = function(req, res){
	var num = req.params.no;
	
	boview.findById(num, req.query.id, function(board){
		commview.viewComment(num, function(comm){
			res.render('boardShow', {
				title: 'show',
				board: board,
				comm: comm,
				id:req.query.id //add 120707 JH
			});
		});
	});
}

exports.boardNumView = function(req, res){
	var num = req.params.id;
	
	boview.findById(num, function(board){
		commview.viewComment(num, function(comm){
			res.render('boardShow', {
				title: 'show',
				board: board,
				comm: comm
			});
		});
	});
}


exports.boardPreview = function(req, res){
	var board = {subject:'', user_name:'', insert_date:'', content:'', no:0, };
	var comm=[];
	board.subject = req.body.subject;
	board.user_name = req.body.name;
	board.insert_date = new Date();
	board.content = req.body.memo;
	var k=-1;
	
	res.render('board/show', {
		title: '미리보기',
		board_id: req.body.id,
		sessionId: req.session.user.Id,
		board: board,
		comment: comm
	});
}

exports.commentDeleteForm = function(req, res){
	var board_id = req.query.board_id;
	var board_num = req.query.board_num;
	var comment_id = req.query.comment_id;
	
	res.render('commDelete', {
		title: 'commDelete',
		board_id: board_id,
		board_num: board_num,
		comment_id: comment_id
	});
}

exports.commentDelete = function(req, res){
	var board_id = req.body.board_id;
	var board_num = req.body.board_num;
	var comment_id = req.body.comment_id;
	var password = req.body.password;
	
	commDelete.deleteComment(board_id, board_num, comment_id, password, res);
}


exports.session = function(req, res){
	users.authenticate(req.body.id, req.body.password, function(user){
		console.log(user);
		
		if(user){
			console.log('auth_success');
			req.session.user = user;
			res.redirect('/board_main');
		}
		else{
			var alert_script = alert.makeAlert('존재하지 않는 계정이거나 계정 정보가 잘못되었습니다.');
			res.render('alert',{
				title : 'error'
				,alert : alert_script
			});
		}
	});
};


exports.adminView = function(req, res){
	board_list.view(req, res);
}//end of adminView

exports.adminCheck = function(req, res){
	// SuperUser || Admin
	var id = req.body.Id;
	var password = req.body.password;
	
	adminCheck.SuperUserAuth(id, password, function(user){
		if(user){ // SuperUser Login
			req.session.user = user;			
			res.redirect('/admin/main');
		}
		else{ // Admin Login	
			adminCheck.AdminAuth(id, password, function(user){
				if(user){
					req.session.user = user;			
					res.redirect('/admin/main');
				}
				else{ // Guest or login fail.
					var alert_script = alert.makeAlert('존재하지 않는 계정입니다.')
					res.render('alert', {
						title : 'error',
						alert : alert_script
					});	
				}
			});
		}
	});
}


exports.makeBoard = function(req, res){
	boardMake.make(req, res);
}


exports.userlistView = function(req, res){
	var type = req.query.type || "";
	var content = req.query.content || "";
	var current_page = req.query.page || 1;
	
	users.allUser(type, content, current_page, res);
}

/* e-mail sending part
 * called in "userlist" by the administrator
 * by Yoon-seop
 */
exports.sendmailView = function(req, res){
	res.render('admin/sendmail', {
		title: 'Send e-mail'
		, sender: 'operator@goorm.org'
		, addresses: req.body.chklist
	});
}
exports.sendmailAction = function(req, res){
	notify.Sendmail(req.body.sender, req.body.address, req.body.subject, req.body.content);
	var alert_script = alert.AlertRedirect('메일이 발송되었습니다.', '/admin/userlists');
	res.render('alert', {
		title : 'Mail Sended'
		,alert : alert_script
	});
}

/* User Ban (delete user operation by the admin)
 * by Yoon-seop, 12.7.12
 */
exports.deleteUser = function(req, res){
	deleteUserService.deleteUser(req);

	//console.log(req.query.id);
	var alert_script = alert.AlertRedirect('회원정보가 삭제되었습니다.', '/admin/userlists');
	res.render('alert', {
		title : 'Result'
		, alert : alert_script
	});
}

exports.write_notice = function(req, res) {
	res.render('admin/board_notice_write', {
		title : 'Write Notice',
		id : req.query.id
	});
}
exports.insert_notice = function(req, res) {
	console.log("index:"+req.session.user.Id);
	if( (""!=req.body.subject) && (""!=req.body.name) && (""!=req.body.memo) ) {
		notice.insert(req.session.user.Id, req.body, res);
	}
	else {
		var alert_script = alert.makeAlert('비어있는 항목이 있습니다.');
		res.render('alert', {
			title : 'Error',
			alert : alert_script
		}) ;
	}
}

exports.show_notice = function(req, res) {
	notice.show(req.query, res, req.session.user.Id);
}

exports.notice_delete = function(req, res){
	notice.del(req.query, req.session.user.Id, res);
}

exports.notice_modify_view = function(req, res){
	notice.modify(req.query, req.session.user.Id, res);
}

exports.notice_update = function(req, res){
	notice.update(req.body, req.session.user.Id, res);
}


