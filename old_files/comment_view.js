
var dbModel = require('../../Database/ConnectDB');

exports.viewComment = function(board_id, board_num, callback){
	dbModel.connectCommentDB(board_id);
	var commentModel = dbModel.tossCommentModel();
	
	var i=0;
	while(i<10) {
		console.log(i);
		i++;
	}
	
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

exports.view_notice_comment = function(board_id, board_num, callback){
	dbModel.connect_notice_comment(board_id);
	var model = dbModel.toss_notice_comment_model();
	
	model.find({boardNo:board_num}).sort('date', -1).exec( function(err, docs){
		if(!err){
			callback(docs);
		}
		else{
			console.log('not find');
			callback(null);
		}
	});
}
