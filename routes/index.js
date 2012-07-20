// account
var account = require('../modules/account/account');
// recent posts or comments
var recent_docs = require('../modules/admin/recent_docs');
// admin
var admin = require('../modules/admin/admin');
// make alert script
var alert = require('../modules/alert/alert')
// skin manager?!
var skin_manager = require('../modules/skin_manager/service');
// board
var board = require('../modules/board/board');
//comment
var comment = require('../modules/comment/comment');

exports.html_sub1_1 = function(req, res){
	res.render('sub01/sub01', { title: 'sub1_1' , session: req.session.user });
}
exports.html_sub1_2 = function(req, res){
	res.render('sub01/sub02', { title: 'sub1_2' , session: req.session.user });
}
exports.html_sub1_3 = function(req, res){
	res.render('sub01/sub03', { title: 'sub1_3' , session: req.session.user });
}
exports.html_sub1_4 = function(req, res){
	res.render('sub01/sub04', { title: 'sub1_4' , session: req.session.user });
}

exports.index = function(req, res){
	account.show_index_page(req, res);
};

exports.admin = function(req, res){
	admin.show_index_page(req, res);	
}

exports.board_make_form = function(req, res){
	// 주석 남겨두세요 나중에 스킨 적용할때 쓸 예정 - by Yoon-seop
	// var skinlist = new Array();
	// skin_manager.getBoardSkinList(function(skinlist){
		// res.render('admin/board_make_form', {
			// title: 'board_make_form'
			// , skins: skinlist
		// });
	// });
	res.render('admin/board_make_form', {
		title: 'board_make_form'
		, session: req.session.user
	});
}


exports.recent_comment_view = function(req, res) {
	recent_docs.comment(req, res);
}


exports.board_recent_view = function(req, res) {
	recent_docs.post(req, res);
}



exports.session = function(req, res){
	account.session(req, res);
}


exports.user_list = function(req, res){
	account.list(req, res);
}

exports.logout = function(req, res) {
	account.logout(req,res);
}

exports.user_information_view = function(req, res){
	account.information(req.params.id, req, res);
}


exports.user_modify = function(req, res){
	account.modify(req.body, res);
}

exports.join = function(req, res){
	account.sign_up_page(req, res);
}

exports.checkoverlap = function(req, res){
	account.check_overlap(req, res);
}

exports.makeaccount = function(req, res){
	account.insert(req, res);
}

exports.admin_check = function(req, res){
	admin.check(req, res);	
}


exports.make_board = function(req, res){
	admin.make_board(req, res);
}


exports.admin_view = function(req, res){
	admin.board_list_view(req, res);
}

exports.admin_board_modify_view = function(req, res) {
	admin.board_modify_view(req, res);
}

exports.admin_board_update = function(req, res) {
	admin.board_update(req, res);
}

/* e-mail sending part
 * called in "userlist" by the administrator
 * by Yoon-seop
 */
exports.send_mail_view = function(req, res){
	admin.send_mail_view(req, res);
}

exports.send_mail_action = function(req, res){
	admin.send_mail_action(req, res);
}

/* User Ban (delete user operation by the admin)
 * by Yoon-seop, 12.7.12
 */
exports.delete_user = function(req, res){
	admin.delete_user(req,res);
}


exports.board_list_page = function(req, res){
	board.board_list(req, res);
}

exports.board_write_page = function(req, res){
	board.write_page(req, res);
}

exports.board_insert = function(req, res){
	board.check_insert_condition(req,res);
}

exports.board_post_list = function(req, res){
	board.post_list(req,res);
}

exports.board_contents = function(req, res){	
	board.check_display_condition(req, res);
}

exports.board_modify_page = function(req, res){
	board.modify_page(req, res);	
}


exports.board_update = function(req, res){
	board.check_update_condition(req, res);
}

exports.board_delete = function(req, res){
	board.del(req, res);
}

exports.comment_insert = function(req, res){
	comment.insert(req, res);
}

exports.comment_delete = function(req, res) {
	comment.del (req, res);
}

exports.comment_update = function(req, res) {
	comment.update(req, res);
}

//------------------------------------------------------수정완료

exports.boardPreview = function(req, res){
	var board = {subject:'', user_name:'', insert_date:'', content:'', no:0, };
	var comm=[];
	board.subject = req.body.subject;
	board.user_name = req.body.name;
	board.insert_date = new Date();
	board.content = req.body.memo;
	var k=-1;
	
	res.render('board/show', {
		title: '미리보기',
		session: k,
		board_id: req.body.id,
		sessionId: req.session.user.Id,
		board: board,
		comment: comm
	});
}


//
exports.commentDeleteForm = function(req, res){
	var board_id = req.query.board_id;
	var board_num = req.query.board_num;
	var comment_id = req.query.comment_id;
	
	res.render('commDelete', {
		title: 'commDelete',
		board_id: board_id,
		board_num: board_num,
		comment_id: comment_id
		, session: req.session.user
	});
}

exports.commentDelete = function(req, res){
	var board_id = req.body.board_id;
	var board_num = req.body.board_num;
	var comment_id = req.body.comment_id;
	var password = req.body.password;
	
	commDelete.deleteComment(board_id, board_num, comment_id, password, res);
}


