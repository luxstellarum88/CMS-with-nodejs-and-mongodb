/*
	JH. 2012. 7. 10~
*/

var self = module.exports = {
	
	post : function(req, res) {
		var recent_board_db = require('../Database/board/board_db');
		recent_board_db.connect();
		var model = recent_board_db.get_model();
		
		model.find({deleted : false}).sort('insert_date',-1).limit(20).exec(function(err, docs) {
			if ( !err ) {
				res.render('admin/board_recent_view', {
					title : '최근 게시물'
					, docs : docs
					, session: req.session.user				
				});//end of render
			}//end of if
			else {
				console.log("find_recent_doc error");
			}
		});//end of find	
	}, //end of function(post)
	
	comment : function(req, res) {
		var comment_db = require('../Database/board/comment_db');
		comment_db.connect();
		var model = comment_db.get_model();
		
		model.find({deleted : false}).sort('insert_date',-1).limit(20).exec(function(err, docs) {
			
			if ( !err ) {
				res.render('admin/recent_comment_view', {
					title : '최근 코멘트'
					, docs : docs
					, session: req.session.user
				})//end of render
			}//end of err
			else {
				console.log('recent_comment : error');
			}
		});//end of find	
	},//end of function(comment)
}//emd of moduels
