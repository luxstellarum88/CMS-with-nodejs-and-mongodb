/*
	2012. 07. 13. by JH
*/

var db = require('../../Database/board/comment_db');

exports.counter = function(condition, callback) {
	db.connect();
	var model = db.get_model();
	
	console.log(condition);
	
	model.count({deleted : false, post_index : condition}, function(err, counter) {
		if(!err) {
			callback(counter);
		}
		else {
			console.log('in comment/count.js : error(01)');
			callback(null);
		}
	});//end of count	
}//end of counter