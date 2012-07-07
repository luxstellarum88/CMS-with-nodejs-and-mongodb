
var dbModel = require('../Database/ConnectDB');


exports.checkId = function(sessionId, ModifyNo, board_id, callback){
	dbModel.connectBoardDB(board_id);
	var boardModel = dbModel.tossBoardModel();	
	boardModel.findOne({no: ModifyNo}, function(err, docs){
		console.log('checkId : ' + docs);

		if(docs){
			if(docs.Id === sessionId || docs.role === 'admin'){
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
