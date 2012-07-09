
var dbModel = require('../../Database/ConnectDB');
var boardOption = require('../../admin/boardoption');


exports.writeComment = function(req, res, callback){
	//comment, user_id ,res
	var board_id = req.body.board_id;
	var comment = req.body;
	var user = req.session.user;
	var result = new Array;

	boardOption.getById(board_id, function(option){
		if(option){
			dbModel.connectCommentDB(board_id);
			var commentModel = dbModel.makeCommentModel();
			var seqNumber = option.commentSeq;

			commentModel.boardNo = 	comment.boardNoForm;
			commentModel.commId = seqNumber;
			commentModel.Id = user.Id;
			commentModel.name = user.name;
			commentModel.password = comment.passwordForm;
			commentModel.comment = comment.commentForm;
			
			commentModel.save(function(err){
				if(!err){
					result['board_id'] = board_id;
					result['boardNo'] = comment.boardNoForm;
										
					callback(result);
				}
				else{
					console.log('comment_write_fail');
					callback(null);					
				}					
			});
					
		} // if(option) end
		else{
			console.log('not find');
			callback(null);				
		}
	});
}
