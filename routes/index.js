
var assert = require('assert');


var users = require('../account/users');
var userMake = require('../account/makeaccount');

var boview = require('../board/boards');
var bowrite = require('../board/board_write');
var boupdate = require('../board/board_update');
var boCheck = require('../board/board_check');

<<<<<<< HEAD
var commwrite = require('../board/comment/comment_write');
var commview = require('../board/comment/comment_view');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.admin = function(req, res){
	res.render('admin', {title: 'admin'});
}

exports.userlistView = function(req, res){
	users.allUser(req, res);
}



exports.join = function(req, res){
	res.render('join', {title: 'Join'});
};

=======

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.admin = function(req, res){
	res.render('admin', {title: 'admin'});
}

exports.userlistView = function(req, res){
	users.allUser(req, res);
}



exports.join = function(req, res){
	res.render('join', {title: 'Join'});
};

>>>>>>> f5151a2e677d64a5144c020bf1e155072705dd99

exports.makeaccount = function(req, res){
	userMake.insertUser(req, res);
}


exports.boardView = function(req, res){	
	var num = req.query.page;
	var isAdmin;
<<<<<<< HEAD
	var PageName;
=======
>>>>>>> f5151a2e677d64a5144c020bf1e155072705dd99
	
	if(!num)
		num = 1;
	
<<<<<<< HEAD
	if(req.session.user.role == 'admin'){
		isAdmin = true;
		PageName = 'adminView';
	}
	else{
		isAdmin = false;
		PageName = 'boardView';
	}
	
	boview.boardview(function(result){
		res.render(PageName, {
			title: 'board',
			docs: result,
			NowPage: num,
			sessionId: req.session.user.Id
		});	
=======
	if(req.session.user_id == 'adminid'){
		isAdmin = true;
	}
	else{
		isAdmin = false;
	}
	
	boview.boardview(function(result){
		if(isAdmin == false){
			res.render('boardView', {
				title: 'board',
				docs: result,
				NowPage: num,
				sessionId: req.session.user_id
			});	
		}
		else if(isAdmin == true){
			res.render('adminView',{
				title: 'board',
				docs: result,
				NowPage: num,
				sessionId: req.session.user_id
			});
		}
>>>>>>> f5151a2e677d64a5144c020bf1e155072705dd99
	});
}

exports.boardIdView = function(req, res){
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
	})
}

exports.boardWrite = function(req, res){
	bowrite.insertBoard(req, res);
}


exports.boardModify = function(req, res){
	var num = req.query.no;
	
<<<<<<< HEAD
	boCheck.checkId(req.session.user.Id, num, function(result){
=======
	boCheck.checkId(req.session.user_id, num, function(result){
>>>>>>> f5151a2e677d64a5144c020bf1e155072705dd99
		if(result){
			res.render('modify', {
				title: 'modify',
				docs: result
			});	
		}
		else{
			console.log('not matched');
			res.redirect('/board');
		}
				
	});
}


exports.boardUpdate = function(req, res){
	boupdate.update(req.body, res);
}


exports.boardDelete = function(req, res){
	var num = req.query.no;
	
<<<<<<< HEAD
	boCheck.checkId(req.session.user.Id, num, function(result){
=======
	boCheck.checkId(req.session.user_id, num, function(result){
>>>>>>> f5151a2e677d64a5144c020bf1e155072705dd99
		if(result){
			result.remove();
			res.redirect('/board');
		}
		else{
			console.log('not matched');
			res.redirect('/board');
		}
				
	});
}

<<<<<<< HEAD

exports.commentWrite = function(req, res){
	commwrite.writeComment(req.body, req.session.user.Id ,res);
}


=======
>>>>>>> f5151a2e677d64a5144c020bf1e155072705dd99
exports.session = function(req, res){
//	id = req.query.id || req.body.id;
//	pw = req.query.pw || req.body.password;	
	users.authenticate(req.body.id, req.body.password, function(user){
		console.log(user);
		
		if(user){
			console.log('auth_success');
<<<<<<< HEAD
			req.session.user = user;
=======
			req.session.user_id = user.Id;
>>>>>>> f5151a2e677d64a5144c020bf1e155072705dd99
			res.redirect('/board');
		}
		else{
			res.redirect('/');
		}
	});
};
