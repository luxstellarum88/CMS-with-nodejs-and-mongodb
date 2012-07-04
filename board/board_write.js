
var dbSeqModel = require('../Database/BoardSequence');
var dbModel = require('../Database/ConnectDB');

dbSeqModel.connectBoardSeqDB();
dbModel.connectBoardDB();

exports.insertBoard = function(req, res){
	var __number;
	var boardModel = dbModel.makeBoardModel();

	var board = req.body;

	dbSeqModel.boardSeqNumber(function(number){
		boardModel.no = number;
		boardModel.Id = req.session.user.Id;
		boardModel.subject = board.subject;
		boardModel.name = board.name;
		boardModel.memo = board.memo;
		boardModel.date = new Date();

		dbSeqModel.SeqInc();

		boardModel.save(function(err){
			if(!err){
				console.log('board_insert_success');
			}			
			else
				console.log('board_insert_fail');
			
			res.redirect('/board');
		});
	});
}
