
var dbModel = require('../Database/ConnectDB');

dbModel.connectBoardDB();

exports.checkId = function(sessionId, ModifyNo, callback){
	var boardModel = dbModel.tossBoardModel();	
	boardModel.findOne({no: ModifyNo}, function(err, docs){
		console.log('checkId : ' + docs);

		if(docs){
			if(docs.Id == sessionId || sessionId == 'adminid'){
				callback(docs);
			}
			else{			
				callback(null);
			}
		}
		else{
			callback(null);
		}	
	});
}
