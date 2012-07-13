/*
	2012. 07. 13. by JH
*/
var alert = require('../alert/alert');
var db = require('../Database/board/board_db');
db.connect();

exports.show = function(req, res) {
	var model = db.get_model();
	
	var user_id = req.session.user.Id;
	var board_id = req.query.id;
	var board_index = req.query.num;
	
	model.findOne({board_id : board_id, index : board_index},function(err, docs){
		if(!err) {
			if(docs.user_id === user_id) {
				res.render('board/modify', {
					title: 'Board Modify',
					docs: docs
				});//end of render
			}//end of if
			else {
				var alert_script = alert.makeAlert('권한이 없습니다.');
					res.render('alert', {
					title : 'Error'
					,alert : alert_script
				});//end of alert
			}//end of else
		}//end of if
		else {
			console.log('in modify.js : error(01)');
		}
	});//end of find
}//end of show

exports.update = function(req, res) {
	var model = db.get_model();
	
	var user_id = req.session.user.Id;
	var board_id = req.body.board_id;
	var board_index = req.body.index;
	var subject = req.body.subjectForm;
	var content = req.body.memoForm;
	
	var condition = {board_id : board_id, index : board_index};
	var update = {subject : subject, content : content, update_date : new Date()};
	
	model.findOne({board_id : board_id, index : board_index},function(err, docs){
		if(!err) {
			if(docs.user_id === user_id) {
				model.update(condition, update, null, function(err){
					if(!err) {
						var alert_script = alert.AlertRedirect('수정되었습니다.', '/board?id='+board_id);
						res.render('alert', {
							title : 'Success'
							,alert : alert_script
						});//end
					}//end of if
					else {
						var alert_script = alert.makeAlert('오류가 발생했습니다.');
							res.render('alert', {
							title : 'Error'
							,alert : alert_script
						});//end of alert
					}
				}); //end of update
			}//end of if
			else {
				var alert_script = alert.makeAlert('권한이 없습니다.');
					res.render('alert', {
					title : 'Error'
					,alert : alert_script
				});//end of alert
			}//end of else
		}//end of if
		else {
			console.log('in modify.js : error(01)');
		}
	});//end of find
	
}
