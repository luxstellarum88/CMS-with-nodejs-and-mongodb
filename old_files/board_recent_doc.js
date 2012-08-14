/*
	JH. 2012. 7. 10~
*/
var db = require('../Database/board/board_db');

exports.show = function(req, res) {
	db.connect();
	var model = db.get_model();
	
	model.find({deleted : false}).sort('date',-1).limit(20).exec(function(err, docs) {
		if(!err) {
			res.render(language+'/'+'admin/board_recent_view', {
				title : 'Recent Docs',
				docs : docs,				
			});//end of render
		}//end of if
		else {
			console.log("find_recent_doc error");
		}
	});//end of find	
}//end of function
