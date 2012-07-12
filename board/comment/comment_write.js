
var dbModel = require('../../Database/ConnectDB');
var boardOption = require('../../admin/boardoption');


exports.writeComment = function(req, res, callback){
	//comment, user_id ,res
	var board_id = req.body.board_id;
	var comment = req.body;
	var user = req.session.user;
	var result = new Array;
	insert_recent_comment(comment.boardNoForm, user.Id, user.name, comment.passwordForm, comment.commentForm, board_id);
	if('true' != req.body.notice) {
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
	} // end of if (notice)
	else{ //공지사항인경우
		dbModel.connect_notice_comment(board_id);
		var comm_no;
				
		find_model = dbModel.toss_notice_comment_model();
		find_model.count(function(err, number) {
			if(!err){
				if( 0 === number ) {
					comm_no = 1;
					insert_notice_comment(comment.boardNoForm, comm_no, user.Id, user.name, comment.passwordForm, comment.commentForm, board_id, callback);
					
				}//end of if
				else {
					find_model.findOne().sort('commId', -1).exec(function(err, docs) {
						comm_no = docs.commId + 1;
						insert_notice_comment(comment.boardNoForm, comm_no, user.Id, user.name, comment.passwordForm, comment.commentForm, board_id, callback);
						
					});//end of findOne
				}//end of else
			}//end of if(!err)
			else {
				console.log('error!!');
				callback(null);
			}			
		});//end of count
	}//end of else
} //end of writecomment

function insert_notice_comment(post_no, comm_no, id, name, password, comment, board_id, callback) {
	dbModel.connect_notice_comment(board_id);
	var model = dbModel.make_notice_comment_model();
	var result = new Array();
	
	model.boardNo = 	post_no;
	model.commId = comm_no;
	model.Id = id;
	model.name = name;
	model.password = password;
	model.comment = comment;
	model.date = new Date();
	
	model.save(function(err){
		if(!err){
			result['board_id'] = board_id;
			result['boardNo'] = post_no;
			console.log('notice_comment_write_success');
			callback(result);
		}
		else{
			console.log('notice_comment_write_fail');
			callback(null);
		}					
	});//end of save
} // end of insert


/*
	2012 07 12 by JH. function for insert recnet comment to recent comment collection
	- insert_recent_comment
	- save_recent_comment
*/

function insert_recent_comment(post_no, id, name, password, comment, board_id) {
	dbModel.connect_recent_comment();
	var find_model = dbModel.toss_recent_comment_model();
	var comment_no;
	find_model.count(function(err, counter){
		if(!err){
			if(0 === counter) {
				comment_no = 1;
				save_recent_comment(post_no, comment_no, id, name, password, comment, board_id);
			}//end of if (counter)
			else {
				find_model.findOne().sort('no',-1).exec(function(err, docs) {
					comment_no = docs.no + 1;
					save_recent_comment(post_no, comment_no, id, name, password, comment, board_id);
				});//end of findOne
			}//end of else
		}//end of if(!err)
		else{
			console.log('in comment_write.js, func insert_recent_comment : count fail');
		}//end of else(!err)
	});//end of count
}//end of insert recent comment

function save_recent_comment(post_no, comm_no, id, name, password, comment, board_id) {
	dbModel.connect_recent_comment();
	var save_model = dbModel.make_recent_comment_model();
	
	save_model.no = comm_no;
	save_model.boardNo = post_no;
	save_model.Id = id;
	save_model.name = name;
	save_model.password = password;
	save_model.comment = comment;
	save_model.date = new Date();
		
	save_model.save(function(err) {
		console.log(err);
		if(!err) {
			console.log('in comment_write.js, func save_recent_comment : save success');
		}
		else {
			console.log('in comment_write.js, func save_recent_comment : save fail');
		}
	}); //end of save
}// end of save_recent_comment
