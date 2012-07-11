var db = require('../Database/ConnectDB');
var alert = require('../alert/alert');

function commit(session, doc_no, contents, res) {
	db.connect_notice_board(contents.id);
	var insert_model = db.make_notice_board_model();
	insert_model.no = doc_no;
	insert_model.id = session;
	insert_model.subject = contents.subject;
	insert_model.name = contents.name;
	insert_model.memo = contents.memo;
	insert_model.date = new Date();
	
	insert_model.save(function(err){
		if(!err) {
			console.log('notice insert success');
		}
		else {
			console.log('notice insert fail');
		}
		
		res.redirect('/board?id='+contents.id);
	});//end of save			
}//end of commit

exports.insert = function(session, contents, res) {
	db.connect_notice_board(contents.id);
	var find_model = db.toss_notice_board_model();
	var doc_no;
	find_model.count(function(err, number) {
		if(0 === number) {
			doc_no = 1;
			commit(session, doc_no, contents, res );
		}//end of if
		else {
			find_model.findOne().sort('no', 1).exec(function(err, docs) {
				if(!err) {
					doc_no = docs.no+1;
					commit(session, doc_no, contents, res );
				}//end of if
				else{
					console.log ('err');
				}//end of else
			});//end of find
		}//end of else
	}); //end of count
}//end of insert


exports.show = function(contents, res, session) {
	var commview = require('../board/comment/comment_view');
	db.connect_notice_board(contents.id);
	var find_model = db.toss_notice_board_model();
	
	find_model.findOne({no : contents.num}, function(err, docs) {
		commview.viewComment(contents.id, contents.num, function(comm){
			if(!err) { //comment 추가 예정
				res.render('boardShow', {
					title : 'Show Notice',
					board : docs,
					board_id : contents.id,
					sessionId : session,
					comm : comm,
					notice : true
				})//end of render
			}//end of if
			else{
				console.log('find err');
			}//end of else
		})//end of commview
	});//end of find
}//end of show

exports.del = function(contents, session, res) {
	db.connect_notice_board(contents.id);
	var find_model = db.toss_notice_board_model();
	
	find_model.findOne({no : contents.num}, function(err, docs) {
		if(session === docs.id || session === 'superadmin') {
			docs.remove();
			res.redirect('/board?id=' + contents.id);
		}//end of if
		else {
			var alert_script = alert.makeAlert('권한이 없습니다.');
			res.render('alert', {
			title : 'Error'
			,alert : alert_script
			});
		}//end of else
	}); //end of find
}//end of del

exports.modify = function(contents, session, res) {
	db.connect_notice_board(contents.id);
	var find_model = db.toss_notice_board_model();
	
	find_model.findOne({no : contents.num}, function(err, docs) {
		if(session === docs.id || session === 'superadmin') {
			res.render('modify', {
				title : 'notice modify',
				docs : docs,
				id : contents.id,
				notice : true
			});
		}//end of if
		else {
			var alert_script = alert.makeAlert('권한이 없습니다.');
			res.render('alert', {
			title : 'Error'
			,alert : alert_script
			});
		}//end of else
	}); //end of find
}//end of modify

exports.update = function(contents, session, res) {
	db.connect_notice_board(contents.id);
	var find_model = db.toss_notice_board_model();
	
	var condition = {no : contents.no};
	var update = { subject : contents.subjectForm
								,memo : contents.memoForm
								,date : new Date()}; //end of update
								
	find_model.update(condition, update, null, function(err) {
		if(!err) {
			res.redirect('/board?id=' + contents.id);
		}//end of if
		else {
			var alert_script = alert.makeAlert('오류가 발생했습니다.');
				res.render('alert', {
					title : 'Error',
					alert : alert_script
			});//end of alert
		}//end of else
	});//end of db update
}//end of update function
