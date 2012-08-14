/*
	2012. 07. 13. by JH
	/admin/main 에 보일 페이지를 뿌려줄 js파일
*/

var db = require('../Database/board/board_list_db');
db.connect();

exports.view = function(req, res) {
	var model = db.get_model();
	
	model.find().sort('date', -1).exec(function(err, docs){
		if(!err) {
			res.render(language+'/'+'admin/main', {
				title: 'admin main',
				docs: docs
			});//end of render
		}//end of if
		else {
			console.log('in board_list.js : error');
		}
	});//end of find
}//end of view
