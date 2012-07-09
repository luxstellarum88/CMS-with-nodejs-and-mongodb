
var dbModel = require('../Database/ConnectDB');


exports.checkId = function(board_id, board_num, user, callback){
	dbModel.connectBoardDB(board_id);
	var boardModel = dbModel.tossBoardModel();	
	
	boardModel.findOne({no: board_num}, function(err, docs){
		if(docs){
			if(docs.Id == user.Id || user.role == 'admin'){
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
