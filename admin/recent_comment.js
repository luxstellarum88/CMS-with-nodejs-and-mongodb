/*
	2012. 7. 12. by JH
	updated at 2012. 7. 13 by JH. 
*/
db = require('../Database/board/comment_db');

exports.view = function (req, res) {
	db.connect();
	var model = db.get_model();
	
	model.find({deleted : false}).sort('date',-1).limit(20).exec(function(err, docs) {
		
		if(!err) {
			res.render('admin/recent_comment_view', {
				title : 'Recent Comments',
				docs : docs
			})//end of render
		}//end of err
		else {
			console.log('recent_comment : error');
		}
	});//end of find
}//end of view

