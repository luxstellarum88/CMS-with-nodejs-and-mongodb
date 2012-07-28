var user_db = require('../Database/ConnectDB');
var board_db = require('../Database/board/board_db');

module.exports = {
	index_page : function(req, res) {
		res.render('mypage/mypage', {
			 title : '비밀번호'
			,session : req.session.user
			,authed : 0
		});//end of render
	}//end of index_page
	
	,authed : function(req, res) {
		user_db.connectUserDB();
		var model = user_db.tossUserModel();
		var password = req.body.mypage_password;
	}//end of authed
};//end of module export