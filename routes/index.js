
var users = require('../account/users');
var userMake = require('../account/makeaccount');

var boview = require('../board/boards');
var bowrite = require('../board/board_write');
var boupdate = require('../board/board_update');
var boCheck = require('../board/board_check');


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


exports.makeaccount = function(req, res){
	userMake.insertUser(req, res);
}


exports.boardView = function(req, res){	
	var num = req.query.page;
	var isAdmin;
	
	if(!num)
		num = 1;
	
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
	});
}

exports.boardIdView = function(req, res){
	var num = req.params.id;
	
	boview.findById(num, function(result){
		res.render('boardShow', {
			title: 'show',
			docs: result
		})
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
	
	boCheck.checkId(req.session.user_id, num, function(result){
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
	
	boCheck.checkId(req.session.user_id, num, function(result){
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

exports.session = function(req, res){
//	id = req.query.id || req.body.id;
//	pw = req.query.pw || req.body.password;	
	users.authenticate(req.body.id, req.body.password, function(user){
		console.log(user);
		
		if(user){
			console.log('auth_success');
			req.session.user_id = user.Id;
			res.redirect('/board');
		}
		else{
			res.redirect('/');
		}
	});
};
