
var dbModel = require('../Database/ConnectDB');
var alert = require('../alert/alert');

exports.update = function(docs, res){
	dbModel.connectBoardDB(docs.id);
	var boardidentity = dbModel.tossBoardModel();
	
	var conditions = {no : docs.no};
	var updates = { $set:{ subject : docs.subjectForm
							,memo : docs.memoForm
							,date : new Date() }
					};
				
	boardidentity.update(conditions, { subject : docs.subjectForm }, null, function(err){
		if(!err){
			boardidentity.update(conditions, { memo : docs.memoForm }, null, function(err){
				if(!err){
					boardidentity.update(conditions, { date : new Date() }, null, function(err){
						if(!err) {
							res.redirect('/board?id='+docs.id);
						}
					});
				}
			});
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
