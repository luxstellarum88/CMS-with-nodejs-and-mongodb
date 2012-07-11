var adminCheck = require('../admin/admin_check');
var boardMake = require('../admin/makeBoard');
var boardOption = require('../admin/boardoption');
var board_recent_doc = require('../admin/board_recent_doc');
var notice = require('../admin/notice_board');
var notify = require('../admin/notify');			// e-mail, SMS..

var alert = require('../alert/alert')

var users = require('../account/users');
var userMake = require('../account/makeaccount');

var boview = require('../board/boards');
var bowrite = require('../board/board_write');
var boupdate = require('../board/board_update');
var boCheck = require('../board/board_check');

var commwrite = require('../board/comment/comment_write');
var commDelete = require('../board/comment/comment_delete');
var commview = require('../board/comment/comment_view');

exports.index = function(req, res){
	//세션이 있을 경우 board페이지로 바로 넘어가도록 변경
	if(req.session.user) {
		res.redirect('/board');
	}
	else{
  		res.render('index', { title: 'Express' });
 	}
};

exports.admin = function(req, res){
	//세션이 있을 경우 board페이지로 바로 넘어가도록 변경
	if(req.session.user.Id === 'superadmin') {
		res.redirect('/admin/main');
	}
	else{
  		res.render('admin', { title: 'admin' });
 	}	
}

exports.logout = function(req, res) {
	if(req.session.user) {
		req.session.user = "";
		res.redirect('/');
	}
}


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

exports.boardView = function(req, res){	
	var board_id = req.query.id;
	var board_num = req.query.num;
	var PageNum = req.query.page || 1;
	var type = req.query.type || "";
	var content = req.query.content || "";
		
	if(!board_id){
		boardOption.getBoardOption(function(result){
			res.render('boardMain', {
				title: 'boardMain',
				docs: result
			});
		});
	}
	else if(!board_num){
		// /board?id=*&page=*		
		boview.boardview(req, res, board_id, PageNum, type, content);
	}
	else{
		// /board?id=*&num=*
		boview.findById(board_id, board_num, function(board){
			if(board){
				commview.viewComment(board_id, board_num, function(comm){
					res.render('boardShow', {
						title: 'show',
						board_id: board_id,
						board: board,
						comm: comm,
						sessionId: req.session.user.name,
						notice : false
					});
				});	
			}
			else{
				console.log('not find');
				res.redirect('/board?id=' + board_id);
			}
		});
	}
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



exports.write = function(req, res){
	
	var auth = 'guest';
	
	if('admin' === req.session.user.role || 'superadmin' === req.session.user.Id) {
		auth = 'admin';
	}
	
	res.render('write', {
		title: 'write'
		, id : req.query.id
		, auth : auth
	})
}

exports.boardWrite = function(req, res){
	if( (""!=req.body.subject) && (""!=req.body.name) && (""!=req.body.memo) ) {
		if('notice' === req.body.write_type) {
			notice.insert(req.session.user.Id, req.body, res);
		}
		else {
			bowrite.insertBoard(req, res);
		}		
	}
	else {
		var alert_script = alert.makeAlert('비어있는 항목이 있습니다.');
		res.render('alert', {
			title : 'Error',
			alert : alert_script
		}) ;
	}
}


exports.boardModify = function(req, res){
	var board_num = req.query.num;
	var board_id = req.query.id;
	
	boCheck.checkId(board_id, board_num, req.session.user, function(result){
		if(result){
			res.render('modify', {
				title: 'modify',
				docs: result,
				id: board_id, //add 120707 JH
				notice : false
			});	
		}
		else{
			alert_script = alert.makeAlert('권한이 없습니다.');
			res.render('alert', {
			title : 'Error'
			,alert : alert_script
			});
		}
				
	});
}


exports.boardUpdate = function(req, res){
	boupdate.update(req.body, res);
}


exports.boardDelete = function(req, res){
	var board_id = req.query.id;
	var board_num = req.query.num;
	
	boCheck.checkId(board_id, board_num, req.session.user, function(result){
		if(result){
			result.remove();
			res.redirect('/board?id='+board_id);
		}
		else{
			alert_script = alert.makeAlert('권한이 없습니다.');
			res.render('alert', {
			title : 'Error'
			,alert : alert_script
			});
		}
				
	});
}

exports.commentWrite = function(req, res){
	commwrite.writeComment(req ,res, function(result){
		if(result){
			boardOption.CommentSeqInc(result['board_id']);
			res.redirect('/board?id='+result['board_id'] + '&num='+ result['boardNo']);
		}
		else{
			console.log('comment_write_fail');
			res.redirect('back');
		}
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
			res.redirect('/board');
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
	boardOption.getBoardOption(function(result){
		res.render('admin/main', {
			title: 'admin_main',
			docs: result
		});
	});
}

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
	var alert_script = alert.makeAlert('메일이 발송되었습니다.', 'admin/userlists');
	res.render('alert', {
		title : 'Mail Sended'
		,alert : alert_script
	});
}



exports.boardMain = function(req, res){
	boardOption.getBoardOption(function(result){
		res.render('boardMain', {
			title: 'boardMain',
			docs: result
		});
	});
}

exports.board_make_form = function(req, res){
	res.render('admin/board_make_form', {
		title: 'board_make_form'
	});
}

exports.board_recent_view = function(req, res) {
	board_recent_doc.find_recent_doc (req, res);
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
