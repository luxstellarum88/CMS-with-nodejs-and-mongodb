/*
	2012. 7. 12. by JH
*/
db = require('../Database/ConnectDB');
db.connect_recent_comment();

exports.insert = function(req, res) {
	var board_id = req.body.board_id;
	var comment = req.body.commentForm;
	var id = req.session.user.Id;
	var name = req.session.user.name;
	var password = req.body.passwordForm;
	var post_no = req.body.boardNoForm;
	var subject = req.body.board_subject;
	var notice = false;
	if('true' === req.body.notice) notice = true; 
	
	var find_model = db.toss_recent_comment_model();
	var comment_no;
	find_model.count(function(err, counter){
		if(!err){
			if(0 === counter) {
				comment_no = 1;
				save(post_no, comment_no, id, name, password, comment, board_id, subject, notice);
			}//end of if (counter)
			else {
				find_model.findOne().sort('no',-1).exec(function(err, docs) {
					comment_no = docs.no + 1;
					save(post_no, comment_no, id, name, password, comment, board_id, subject, notice);
				});//end of findOne
			}//end of else
		}//end of if(!err)
		else{
			console.log('in recent_comment.js, func insert_recent_comment : count fail');
		}//end of else(!err)
	});//end of count
}//end of insert recent comment

function save(post_no, comm_no, id, name, password, comment, board_id, subject, notice) {
	db.connect_recent_comment();
	var save_model = db.make_recent_comment_model();
	
	save_model.no = comm_no;
	save_model.boardNo = post_no;
	save_model.Id = id;
	save_model.subject = subject;
	save_model.board_id = board_id;
	save_model.name = name;
	save_model.password = password;
	save_model.comment = comment;
	save_model.notice = notice;
	save_model.date = new Date();
		
	save_model.save(function(err) {
		console.log(err);
		if(!err) {
			console.log('in recent_comment.js, func save_recent_comment : save success');
		}
		else {
			console.log('in recent_comment.js, func save_recent_comment : save fail');
		}
	}); //end of save
}// end of save_recent_comment


exports.view = function (req, res) {
	var model = db.toss_recent_comment_model();
	
	model.find().sort('date',-1).limit(20).exec(function(err, docs) {
		if(!err) {
			res.render('admin/recent_comment_view', {
				title : 'Recent Comments',
				docs : docs
			})//end of render
		}//end of err
		else {
			console.log('recent_comment : error');
		}
	});//end of find
}//end of view

