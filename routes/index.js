// account
var account = require('../modules/account/account');
// recent posts or comments
var recent_docs = require('../modules/admin/recent_docs');
// admin
var admin = require('../modules/admin/admin');
// make alert script
var admin_new = require('../modules/admin_new/admin');
// make alert script
var alert = require('../modules/alert/alert')
// skin manager?!
var skin_manager = require('../modules/skin_manager/service');
// board
var board = require('../modules/board/board');
//comment
var comment = require('../modules/comment/comment');
//my page (user information page)
var mypage = require('../modules/mypage/mypage');

exports.html_sub1_1 = function(req, res){
	res.render('sub01/sub01', { title: 'goorm 소개 > 소개' , session: req.session.user });
}
exports.html_sub1_2 = function(req, res){
	res.render('sub01/sub02', { title: 'goorm 소개 > 특징' , session: req.session.user });
}
exports.html_sub1_3 = function(req, res){
	res.render('sub01/sub03', { title: 'goorm 소개 > 데모' , session: req.session.user });
}
exports.html_sub1_4 = function(req, res){
	res.render('sub01/sub04', { title: 'goorm 소개 > 라이센' , session: req.session.user });
}


exports.html_sub2_1 = function(req, res){
	res.render('sub02/sub01', { title: '지원 > 기술지원' , session: req.session.user });
}
exports.html_sub2_2 = function(req, res){
	res.render('sub02/sub02', { title: '지원 > 자주 묻는 질문' , session: req.session.user });
}


// exports.html_sub3_1 = function(req, res){
	// res.render('sub02/sub01', { title: 'sub2_1' , session: req.session.user });
// }
exports.html_sub3_1 = function(req, res){
	res.redirect('/board/freeboard');
}
exports.html_sub3_2 = function(req, res){
	res.render('sub03/sub02', { title: '커뮤니티 > 질문게시판' , session: req.session.user });
}
exports.html_sub3_3 = function(req, res){
	res.render('sub03/sub03', { title: '커뮤니티 > 사용자 팁/노하우' , session: req.session.user });
}


exports.html_sub4_1 = function(req, res){
	res.render('sub04/sub01', { title: '사용방법 > 설치' , session: req.session.user });
}
exports.html_sub4_2 = function(req, res){
	res.render('sub04/sub02', { title: '사용방법 > 매뉴얼' , session: req.session.user });
}
// exports.html_sub4_3 = function(req, res){
	// res.render('sub04/sub03', { title: 'sub4_3' , session: req.session.user });
// }
// exports.html_sub4_4 = function(req, res){
	// res.render('sub04/sub04', { title: 'sub4_4' , session: req.session.user });
// }


exports.html_sub5_1 = function(req, res){
	res.render('sub05/sub01', { title: '다운로드 > 소스코드' , session: req.session.user });
}
exports.html_sub5_2 = function(req, res){
	res.render('sub05/sub02', { title: '다운로드 > 플러그인' , session: req.session.user });
}
exports.html_sub5_3 = function(req, res){
	res.render('sub05/sub03', { title: '다운로드 > 스킨' , session: req.session.user });
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
		title: '게시판 생성'
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

exports.check_id = function(req, res) {
	account.check_id(req, res);
}

exports.check_password = function(req, res) {
	account.check_password(req, res);
}

exports.check_name = function(req, res) {
	account.check_name(req, res);
}

exports.check_email = function(req, res) {
	account.check_email(req, res);
}

exports.check_overlap = function(req, res){
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

/* admin_new part
 *  by Soon-Joe
 */

exports.admin_new_index = function(req, res){
	admin_new.admin_new_index(req, res);
}

exports.admin_new_login = function(req, res){
	admin_new.admin_new_login(req, res);
}

exports.admin_new_common_footer = function(req, res){
	admin_new.admin_new_common_footer(req, res);
}

exports.admin_new_common_head = function(req, res){
	admin_new.admin_new_common_head(req, res);
}

exports.admin_new_common_header = function(req, res){
	admin_new.admin_new_common_header(req, res);
}

exports.admin_new_common_mainMenu = function(req, res){
	admin_new.admin_new_common_mainMenu(req, res);
}

exports.admin_new_common_subHead = function(req, res){
	admin_new.admin_new_common_subHead(req, res);
}

exports.admin_new_inc_leftMenu = function(req, res){
	admin_new.admin_new_inc_leftMenu(req, res);
}

exports.admin_new_sub1_1 = function(req, res){
	admin_new.admin_new_sub1_1(req, res);
}

exports.admin_new_sub1_2 = function(req, res){
	admin_new.admin_new_sub1_2(req, res);
}

exports.admin_new_sub2_1 = function(req, res){
	admin_new.admin_new_sub2_1(req, res);
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

exports.board_modify_ajax = function(req, res){
	board.modify_ajax(req, res);
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

exports.comment_check_ajax = function(req, res){
	comment.check_ajax(req, res);
}

exports.mypage_auth = function(req, res) {
	mypage.index_page(req, res);
}



//------------------------------------------------------수정완료
exports.boardPreview = function(req, res){
	var board = {subject:'', user_name:'', insert_date:'', content:'', no:0, };
	var comm=[];
	board.subject = req.body.subject;
	board.user_name = req.body.name;
	board.insert_date = new Date();
	board.content = req.body.tx_content;
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
		title: '코멘트 삭제',
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


