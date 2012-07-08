
var dbModel = require('../Database/ConnectDB');
var alert = require('../alert/alert');

exports.update = function(docs, res){
	dbModel.connectBoardDB(docs.id);
	var board_model = dbModel.tossBoardModel();
	
	var conditions = {no : docs.no};
	var updates = { subject : docs.subjectForm
									,memo : docs.memoForm
									,date : new Date()	};
	
	board_model.update(conditions, updates, null, function(err){
			if(!err){
				console.log('error?no?');
				res.redirect('/board?id='+docs.id);
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