/*
	2012. 07. 13. by JH
*/

var db = require('../Database/board/board_list_db');
db.connect();

exports.view = function(req, res) {
	var model = db.get_model();
	
	model.find().sort('date', -1).exec(function(err, docs){
		if(!err) {
			res.render('boardMain', {
				title: 'Board Main',
				docs: docs
			});//end of render
		}//end of if
		else {
			console.log('in list.js : error');
		}
	});//end of find
}//end of view
