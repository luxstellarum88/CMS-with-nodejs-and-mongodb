/*
	JH. 2012. 7. 10~
*/
var db = require('../Database/ConnectDB');

exports.find_recent_doc = function(req, res) {
	db.connect_board_recent_db();
	model = db.toss_board_recent_model();
	
	model.find().sort('date',-1).exec(function(err, docs) {
		if(!err) {
			res.render('admin/board_recent_view', {
				title : 'Recent Docs',
				docs : docs,				
			});//end of render
		}//end of if
		else {
			console.log("find_recent_doc error");
		}
	});//end of find	
}//end of function
