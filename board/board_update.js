
var dbModel = require('../Database/ConnectDB');
dbModel.connectBoardDB();

exports.update = function(docs, res){
	var boardidentity = dbModel.tossBoardModel();
	
	var conditions = {name: docs.nameForm};
	var updates = { 
					$set:{ 
						subject: docs.subjectForm, 
						memo: docs.memoForm, 
						date: new Date()
					}
				};
	
	boardidentity.update(conditions, updates, null, function(err){
		if(!err){
			res.redirect('/board');
		}
		else{
			console.log('update fail');
			res.redirect('/board');
		}
	});
}
