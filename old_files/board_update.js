
var dbModel = require('../Database/ConnectDB');
var alert = require('../alert/alert');

exports.update = function(docs, res){
	dbModel.connectBoardDB(docs.id);
	var board_model = dbModel.tossBoardModel();
	var alert_script;
	var conditions = {no : docs.no};
	var updates = { subject : docs.subjectForm
									,memo : docs.memoForm
									,date : new Date()	};
	
	board_model.update(conditions, updates, null, function(err){
		if(!err){
			//최신 글 갱신
			dbModel.connect_board_recent_db();
			var model = dbModel.toss_board_recent_model();
			conditions = {board_no : docs.no};
			updates = {subject : docs.subjectForm
									,content : docs.memoForm
									,date : new Date()	};
			model.update(conditions, updates, null, function(err) {
				console.log(updates);
				if(!err) {
					res.redirect('/board?id='+docs.id);
				}
				else{
					alert_script = alert.makeAlert('오류가 발생했습니다.');
					res.render('alert', {
						title : 'Error'
						, alert : alert_script
					});
				}				
			}); //end of update			
		}
		else{
			var alert_script = alert.makeAlert('오류가 발생했습니다.');
			res.render('alert', {
				title : 'Error'
				, alert : alert_script
			});
		}
	});
}