
var dbModel = require('../../Database/ConnectDB');
var alert = require('../../alert/alert');

exports.deleteComment = function(board_id, board_num, comment_id, password, res){
	dbModel.connectCommentDB(board_id);
	var commentModel = dbModel.tossCommentModel();
	
	commentModel.findOne({boardNo:board_num, commId:comment_id}, function(err, docs){
		if(!err && docs && (docs.password == password)){
			docs.remove();
			alert.makePasswordAlert('success', res);
		}
		else{
			alert.makePasswordAlert('fail', res);
		}
	});
}