/*
	2012. 07. 13. by JH
*/

var db = require('../Database/board/board_db');
var comment = require('./comment/view');

exports.contents = function(req, res) {
	db.connect();
	var model = db.get_model();
	
	var board_id = req.query.id;
	var board_index = req.query.num;
	
	model.findOne({index : board_index, board_id : board_id}, function(err, docs){
		if(!err){
			comment.list(req, res, function(comments, length){
				res.render('board/show', {
					title : 'Show Contents',
					board : docs,
					board_id : board_id,
					comment : comments,
					length : length,
					sessionId : req.session.user.Id
				});//end of render
			});//end of comment list
		}//end of if
		else{
			console.log('in show_contets : error(01)');
		}//end of else 
	});//end of findOne
}//end of function

 
