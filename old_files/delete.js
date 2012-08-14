/*
	2012. 07. 13. by JH
*/

var db = require('../Database/board/board_db');
var alert = require('../alert/alert');

exports.del = function(req, res) {
	var model = db.get_model();
	
	var user_id = req.session.user.Id;
	var user_role = req.session.user.role;
	var board_id = req.query.id;
	var board_index = req.query.num;
	
	var condition = {board_id : board_id, index : board_index};
	var update = {deleted : true};
	
	model.findOne({board_id : board_id, index : board_index},function(err, docs){
		if(!err) {
			if(docs.user_id === user_id || 'superadmin' === user_id || 'admin' === user_role) {
				model.update(condition, update, null, function(err){
					if(!err) {
						var alert_script = alert.AlertRedirect('삭제되었습니다..', '/board?id='+board_id);
						res.render(language+'/'+'alert', {
							title : 'Success'
							,alert : alert_script
						});//end
					}//end of if
					else {
						var alert_script = alert.makeAlert('오류가 발생했습니다.');
							res.render(language+'/'+'alert', {
							title : 'Error'
							,alert : alert_script
						});//end of alert
					}
				}); //end of update
			}//end of if
			else {
				var alert_script = alert.makeAlert('권한이 없습니다.');
					res.render(language+'/'+'alert', {
					title : 'Error'
					,alert : alert_script
				});//end of alert
			}//end of else
		}//end of if
		else {
			console.log('in modify.js : error(01)');
		}
	});//end of find
}//end of del
