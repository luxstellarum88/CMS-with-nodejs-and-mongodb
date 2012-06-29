
var dbModel = require('../Database/ConnectDB');
dbModel.connectBoardDB();

exports.boardview = function(callback){
	var boardModel = dbModel.tossBoardModel();
	var result = new Array;
	
	boardModel.find({}, [], function(err, docs){
			if(!err){
				result = docs;
				callback(result);
			}
			else{
				console.log("not find");
				callback(result);
			}	
		});
}

exports.findById = function(id, callback){
	var boardModel = dbModel.tossBoardModel();
	var num = id;

	boardModel.findOne({no:num}, function(err, docs){
			if(!err){
				result = docs;
				callback(result);
			}
			else{
				console.log("not find");
				callback(result);
			}	
		});	
}
