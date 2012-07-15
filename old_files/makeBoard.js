/*
	2012. 7. 13. by JH
	DB 구조 변경
*/


var db = require('../Database/board/board_list_db');
db.connect();

exports.make = function(req, res){
	var model = db.make_model();
	var board = req.body;
	
	model.id = board.id;
	model.name = board.name;
	model.paging = board.pagingNumber;
	model.date = new Date();
	
	model.save(function(err){
		if(!err){
			res.redirect('/admin/main');
		}
		else {
			console.log('in makeBoard.js : make fail');
			res.redirect('/admin/main');
		}
	});//end of save
}
