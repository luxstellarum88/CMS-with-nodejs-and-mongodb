
var dbModel = require('../Database/ConnectDB');
var dbSeqModel = require('../admin/boardoption');

exports.insertBoard = function(req, res){
	
	dbModel.connectBoardDB(req.body.id);
	var __number;
	var boardModel = dbModel.makeBoardModel();

	var board = req.body;

	dbSeqModel.getById(board.id, function(number){
		boardModel.no = number.boardSeq;
		boardModel.Id = req.session.user.Id;
		boardModel.subject = board.subject;
		boardModel.name = board.name;
		boardModel.memo = board.memo;
		boardModel.date = new Date();

		dbSeqModel.boardSeqInc(board.id);

		boardModel.save(function(err){
			if(!err){
				console.log('board_insert_success');
			}			
			else
				console.log('board_insert_fail');
			
			res.redirect('/board?id=' + board.id);
		});
	});
}
