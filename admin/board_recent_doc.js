/*
	JH. 2012. 7. 10~
*/
var db = require('../Database/ConnectDB');

exports.find_recent_doc = function(req, res) {
	db.connect_board_recent_db();
	var model = db.toss_board_recent_model();
	
	model.find().sort('date',-1).limit(20).exec(function(err, docs) {
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


exports.del= function(no, callback) {
	db.connect_board_recent_db();
	var model = db.toss_board_recent_model();
	
	model.findOne({board_no : no}, function(err, docs) {
		if(!err){
			callback(docs);
		}//end of if(!err)
		else{
			console.log("in board_recent_doc.js : error");
			callback(null);
		}
	});//end of findOne
}//end of delete
