
var dbModel = require('../Database/ConnectDB');
var dbSeqModel = require('../admin/boardoption');

exports.insertBoard = function(req, res){
	
	dbModel.connectBoardDB(req.body.id);
	var __number;
	var board_seq_num;
	var boardModel = dbModel.makeBoardModel();

	var board = req.body;

	dbSeqModel.getById(board.id, function(number){
		board_seq_num = number.boardSeq;
		
		boardModel.no = board_seq_num;
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
			
		});
		
		
		dbModel.connect_board_recent_db();
		var make_board_recent = dbModel.make_board_recent_model();
		var board_recent_model = dbModel.toss_board_recent_model();		
		
		board_recent_model.count(function(err, number) {
			
			var no = number + 1;
			
			//최신 글 수를 총 10개로 관리
			if(10 === number) {
				board_recent_model.findOne().sort('date', 1).exec(function(err, docs){
					if(!err && docs) {
						no = docs.no;
						board_recent_model.find({no : docs.no}).remove();
					}
				});
			}//end of if
			console.log(board_seq_num);
			make_board_recent.no = no;
			make_board_recent.board_no = board_seq_num;
			make_board_recent.board_id = req.body.id;
			make_board_recent.id = req.session.user.id;
			make_board_recent.name = board.name;
			make_board_recent.subject = board.subject;
			make_board_recent.content = board.memo;
			make_board_recent.date = new Date();
					
			make_board_recent.save(function(err) {
				if (!err) {
					console.log('save success');
				}
				else {
					console.log('save fail');
				}
				
				res.redirect('/board?id=' + board.id);
			})//end of save
		}); //end of count	
		
	});//end of getById
	
}
