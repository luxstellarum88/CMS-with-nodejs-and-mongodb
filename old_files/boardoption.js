
var dbModel = require('../Database/Connect_Board_DB');
dbModel.connectBoardOptionDB();

exports.getBoardOption = function(callback){
	var boardModel = dbModel.tossBoardOptionModel();
	
	boardModel.find({}, [], function(err, docs){
		if(!err){
			callback(docs);
		}
		else{
			callback(null);
		}
	});
}

exports.getById = function(board_id, callback){
	var boardModel = dbModel.tossBoardOptionModel();
	
	boardModel.findOne({Id: board_id}, function(err, docs){
		if(!err){
			callback(docs);
		}
		else{
			callback(null);
		}
	});	
}

exports.boardSeqInc = function(board_id){
	var board_model = dbModel.tossBoardOptionModel();
	var conditions = {Id: board_id};
	var updates = {$inc:{boardSeq:1}};
	board_model.update(conditions, updates, null, null);
}

exports.hitSeqInc = function(board_id, board_num, number){
	var dbModel2 = require('../Database/ConnectDB');
	dbModel2.connectBoardDB(board_id);
	var board_model = dbModel2.tossBoardModel();
	var conditions = {no: board_num};
	var updates = {$inc:{hit:number}};
	board_model.update(conditions, updates, null, null);
}


exports.CommentSeqInc = function(board_id){
	var boardModel = dbModel.tossBoardOptionModel();
	
	var conditions = {Id:board_id};
	var updates = {$inc:{commentSeq:1}};
	boardModel.update(conditions, updates, null, null);
}
