
var dbModel = require('../../Database/ConnectDB');

dbModel.connectCommentDB();

exports.viewComment = function(__boardNo, callback){
	var commentModel = dbModel.tossCommentModel();
	var commentResult = new Array;
	
	commentModel.find({boardNo:__boardNo}, [], function(err, docs){
		if(!err){
			commentResult = docs;
			callback(commentResult);
		}
		else{
			console.log('not find');
			callback(null);
		}
	});
}
