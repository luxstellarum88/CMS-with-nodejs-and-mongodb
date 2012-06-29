
var users = require('../account/users');
var boview = require('../board/boards');
var bowrite = require('../board/board_write');
var boupdate = require('../board/board_update');



exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.boardView = function(req, res){	
	var num = req.query.page;
	if(!num)
		num = 1;
		
	boview.boardview(function(result){
		res.render('boardView', {
			title: 'board',
			docs: result,
			NowPage: num
		});
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
	bowrite.insertBoard(req.body, res);
}


exports.boardModify = function(req, res){
	var num = req.query.no;
	
	console.log('modify');
	
	boview.findById(num, function(result){
		res.render('modify', {
			title: 'modify',
			docs: result
		});
	});
}


exports.boardUpdate = function(req, res){
	boupdate.update(req.body, res);
}


exports.boardDelete = function(req, res){
	var __id = req.query.no;

	console.log('delete');
	
	boview.findById(__id, function(result){
		if(result)
			result.remove();
			
		res.redirect('/board');		
	});
}


exports.sessionNew = function(req, res){
 	res.render('sessions/new', {title: 'login', locals: {
 			redir: req.query.redir
 		}
 	});
};

exports.session = function(req, res){
	users.authenticate(req.body.login, req.body.password, function(user){
		if(user){
			req.session.user_id = user;
			res.redirect(req.body.redir || '/');
		}
		else{
			res.render('sessions/new', {title: 'login', locals : 
				{redir: req.body.redir}	
			});
		}
	});
};
