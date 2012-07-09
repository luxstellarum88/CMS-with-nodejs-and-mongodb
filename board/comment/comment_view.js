
var dbModel = require('../../Database/ConnectDB');

exports.viewComment = function(board_id, board_num, callback){
	dbModel.connectCommentDB(board_id);
	var commentModel = dbModel.tossCommentModel();
	
	commentModel.find({boardNo:board_num}, [], function(err, docs){
		if(!err){
			callback(docs);
		}
		else{
			console.log('not find');
			callback(null);
		}
	});
}
