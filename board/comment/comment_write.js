
var dbModel = require('../../Database/ConnectDB');

dbModel.connectCommentDB();

exports.writeComment = function(comment, user_id ,res){
	var commentModel = dbModel.makeCommentModel();
	
	commentModel.boardNo = 	comment.boardNoForm;
	commentModel.Id = user_id;
	commentModel.password = comment.passwordForm;
	commentModel.comment = comment.commentForm;
	
	commentModel.save(function(err){
		if(!err){
			console.log('comment_write_success');
		}
		else
			console.log('comment_write_fail');
			
		res.redirect('/board/' + comment.boardNoForm);
	});
}
