var alert = require('../alert/alert');

var self = module.exports = {
	send_mail : function(sender, address, subject, content){
		var email = require('mailer');
		var addresses = "";
			
		if ( Object.prototype.toString.call(address) == '[object Array]' ) {
			address.forEach(function(item){
				addresses = addresses + item + ", "; 
			});
		}
		else {
			addresses = address;
		}
		
		console.log('in admin.js _ send_mail : ' + addresses);
		email.send({
		    host : "smtp.gmail.com",
		    port : "465",
		    ssl : true,
		    domain : "domain.com",
		    to : addresses,
		    from : sender,
		    subject : subject,
		    body: content,
		    authentication : "login",        // auth login is supported; anything else $
		    username : '',
		    password : ''
		    },
		    function(err, result){
		      if ( err ) {
		      	console.log(err); return;
		      } else
		      	console.log('send mail success to ' + addresses);
		});
	}, //end of sendmail

	send_mail_view : function(req, res) {
		res.render('admin/sendmail', {
			title: 'e-mail 보내기'
			, sender: 'operator@goorm.org'
			, addresses: req.body.chklist
			, session: req.session.user, cookie_id: req.cookies.id
		});
	}, //end of send_mail_view
	
	send_mail_action : function(req, res) {
		self.send_mail(req.body.sender, req.body.address, req.body.subject, req.body.content);
		var alert_script = alert.AlertRedirect('메일이 발송되었습니다.', '/admin/userlists');
		res.render('alert', {
			title : 'Mail Sended'
			,alert : alert_script, cookie_id: req.cookies.id
		});
	}, //end of send_mail_action

	make_board : function(req, res){
		var db = require('../Database/board/board_list_db');
		db.connect();
		var model = db.make_model();
		var board = req.body;
		
		model.id = board.id;
		model.name = board.name;
		model.paging = board.pagingNumber;
		model.comm_paging = board.comm_paging_number; //add at 12.08.01
		model.date = new Date();
		
		model.save(function(err){
			if ( !err ) {
				res.redirect('/admin/main');
			}
			else {
				console.log('in makeBoard.js : make fail');
				res.redirect('/admin/main');
			}
		});//end of save
	},
/*
	2012. 07. 13. by JH
	/admin/main 에 보일 페이지를 뿌려줄 js파일
*/
	board_list_view : function(req, res) {	
		var db = require('../Database/board/board_list_db');
		db.connect();
		var model = db.get_model();
		
		model.find().sort('date', -1).exec(function(err, docs){
			if ( !err ) {
				res.render('admin/main', {
					title: '관리자 메인'
					, docs: docs
					, session: req.session.user, cookie_id: req.cookies.id
				});//end of render
			}//end of if
			else {
				console.log('in board_list.js : error');
			}
		});//end of find
	},//end of view

/*
    2012. 07. 20. by JH
	board를 수정 / 삭제
*/
	board_modify_view : function(req, res) {
		var db = require('../Database/board/board_list_db');
		db.connect();
		var model = db.get_model();
		var id = req.params.id;
		
		model.findOne( {id : id}, function(err, docs) {
			if(!err ) {
				res.render('admin/board_modify_view', {
					title : '게시판 수정'
					, docs : docs
					, session: req.session.user, cookie_id: req.cookies.id
				});//need render
			}//end of if
			else {
				console.log('in admin.js, modify_view : error(01)');
			}//end of else
		});//end of findOne
	},//end of modify_view

	board_update : function(req, res) {
		var db = require('../Database/board/board_list_db');
		db.connect();
		var model = db.get_model();
		var id  = req.params.id;
		var name = req.body.name;
		var paging_size = req.body.paging;
		var comm_paging_size = req.body.comm_paging; //add at 12.08.01
		var condition = { id : id };
		var update = { $set : {
							name : name,
							paging : paging_size,
							comm_paging : comm_paging_size,
							update_date : new Date()
						}};//end of update-state
		model.update(condition, update, null, function(err) {
			if(!err) {
				console.log ('in admin.js, board_update : success');
				var alert_script = alert.AlertRedirect("수정되었습니다.", '/admin/main');
				res.render('alert', {
					title : "Success"
					, alert : alert_script
				});//need render or redirect
			}//end of if
			else{
				console.log ('in admin.js, board_update : err(01)');
			}//end of else
		});//end of update
	},//end of board_update

	board_delete : function(req, res) {
		var db = require('../Database/board/board_list_db');
		db.connect;
		var model = db.get_model();
		var id = req.params.id;
		var condition = { id : id };
		var update = {$set : {
							deleted : true,
							update_date : new Date()
						}};//end of update_state
		model.update(condition, update, null, function(err) {
			if(!err) {
				/*
					res.redirect(''); //end render of redirect
				*/
			}
			else {
				console.log('in admin.js, board_delete : error(01)');
			}
		});//end of update
			
	},
	
	delete_user : function(req, res){
		var dbModel = require('../Database/ConnectDB');
		
		dbModel.connectUserDB();
		var userModel = dbModel.tossUserModel();
		var user_id = req.params.id;
		userModel.findOne({Id: user_id}, function(err, user){
			if ( !err && user ) {
				console.log('in admin.js _ delete_user' + req.session.user.Id);
				console.log('in admin.js _ delete_user' + user.email);
				self.send_mail(
					req.session.user.name + "@goorm.org"
					, user.email
					, "Account Removed"
					,"Your account just have been removed by the administrator." );
				user.remove();
			}
			//console.log(req.query.id);
			var alert_script = alert.AlertRedirect('회원정보가 삭제되었습니다.', '/admin/userlists');
			res.render('alert', {
				title : 'Result'
				, alert : alert_script
			});			
		});
	},//end of deleteUser

	SuperUserAuth : function(id, password, callback){
		var dbModel = require('../Database/Connect_Admin_DB');
		dbModel.connectSuperUserDB();
		
		var UserModel = dbModel.tossSuperUserModel();
	
		UserModel.findOne({Id: id}, function(err, user){
			if ( user ) {
				if ( user.password == password ) {
					callback(user);
				}
				else
					callback(null);
			}
			else
				callback(null);
		});
	}, //end of SuperUserAuth

	AdminAuth : function(id, password, callback) {
		var dbModel = require('../Database/ConnectDB');
		dbModel.connectUserDB();
	
		var UserModel = dbModel.tossUserModel();
		
		// login, password filtering
		UserModel.findOne({Id: id}, function(err, user){
			if ( user ) {
				if ( user.password == password && user.role == 'admin' ) {
					callback(user);
				}
				else
					callback(null);
			}
			else
				callback(null);
		});//end of findOne
	},//end of AdminAuth
	
	check : function(req, res) {
		var id = req.body.Id;
		var password = req.body.password;
		
		self.SuperUserAuth(id, password, function(user){
			if ( user ) { // SuperUser Login
				req.session.user = user;			
				res.redirect('/admin/main');
			}
			else { // Admin Login	
				self.AdminAuth(id, password, function(user){
					if ( user ) {
						req.session.user = user;			
						res.redirect('/admin/main');
					}
					else { // Guest or login fail.
						var alert_script = alert.makeAlert('존재하지 않는 계정입니다.')
						res.render('alert', {
							title : 'error',
							alert : alert_script
						});	
					}
				});
			}
		});
	}, //end of check

	show_index_page : function(req, res) {
		if ( req.session.user ) {
			if ( req.session.user.Id === 'superadmin' ) {
				res.redirect('/admin/main');
			}	else {
		  		res.render('admin', {
		  			title: '관리자 페이지'
		  			, session: req.session.user, cookie_id: req.cookies.id
		  		});
		 	}
	 	}	else {
	  		res.render('admin', {
	  			title: '관리자 페이지'
	  			, session: req.session.user, cookie_id: req.cookies.id
	  		});
		 }
	}, //end of show_index_page
} // end of module
