
//NYS start
var adminCheck = require('../admin/admin_check');
var boardMake = require('../admin/makeBoard');
var boardOption = require('../admin/boardoption');
//NYS end

var assert = require('assert');

var alert = require('../alert/alert')

var users = require('../account/users');
var userMake = require('../account/makeaccount');

var boview = require('../board/boards');
var bowrite = require('../board/board_write');
var boupdate = require('../board/board_update');
var boCheck = require('../board/board_check');
var bosearch = require('../board/board_search');

var commwrite = require('../board/comment/comment_write');
var commview = require('../board/comment/comment_view');

//test code
var alert = require('../alert/alert');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.admin = function(req, res){
	res.render('admin', {title: 'admin'});
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

/*
exports.boardView = function(req, res){	
	var num = req.query.page;
	var PageName;
	
	if(!num)
		num = 1;
	
	if(req.session.user.role == 'admin'){
		PageName = 'adminView';
	}
	else{
		PageName = 'boardView';
	}
	
	boview.boardview(function(result){
		res.render(PageName, {
			title: 'board',
			docs: result,
			NowPage: num,
			sessionId: req.session.user.Id
		});	
	});
}
*/

//NYS start
exports.boardView = function(req, res){	
	var board_id = req.query.id;
	var num = req.query.page;
	var PageName;
		
	if(!board_id){
		console.log('hello');
		boardOption.getBoardOption(function(result){
			res.render('boardMain', {
				title: 'boardMain',
				docs: result
			});
		});
	}
	else{
		if(!num)
			num = 1;
	
		if(req.session.user.role == 'admin'){
			PageName = 'adminView';
		}
		else{
			PageName = 'boardView';
		}
		console.log(board_id);	
		boview.boardview(req, res, board_id, PageName, num);	
	}
}
//NYS end

exports.board_search = function(req, res){	
	var PageName;
	var num = 1;
	
	
	if(req.session.user.role == 'admin'){
		PageName = 'adminView';
	}
	else{
		PageName = 'boardView';
	}
	
	bosearch.board_search(req.body, PageName, num, req, res);
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
	
	res.render('write', {
		title: 'write'
		, id: req.query.id //add 120707 JH
	})
}

exports.boardWrite = function(req, res){
	bowrite.insertBoard(req, res);
}


exports.boardModify = function(req, res){
	var num = req.query.no;
	
	boCheck.checkId(req.session.user.Id, num, req.query.id, function(result){
		if(result){
			res.render('modify', {
				title: 'modify',
				docs: result,
				id: req.query.id //add 120707 JH
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
	var num = req.query.no;
	
	boCheck.checkId(req.session.user.Id, num, req.query.id, function(result){
		if(result){
			result.remove();
			res.redirect('/board?id='+req.query.id);
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
	commwrite.writeComment(req.body, req.session.user.Id ,res);
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
			res.redirect('/');
		}
	});
};


//NYS start

exports.adminView = function(req, res){
	boardOption.getBoardOption(function(result){
		res.render('admin/main', {
			title: 'admin_main',
			docs: result
		});
	});
}

exports.adminCheck = function(req, res){
	adminCheck.authenticate(req.body.id, req.body.password, function(user){
		if(user){
			console.log("admin Checked");
			req.session.user = user;
			
			res.redirect('/admin/main');
		}
		else{
			console.log("admin Check failed");
			res.redirect('/admin');
		}
		
		
	});
}


exports.makeBoard = function(req, res){
	boardMake.make(req, res);
}


exports.userlistView = function(req, res){
	users.allUser(req, res);
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

//NYS end
