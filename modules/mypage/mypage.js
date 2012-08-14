var user_db = require('../Database/ConnectDB');
var board_db = require('../Database/board/board_db');
var comment_db = require('../Database/board/comment_db');

var comment = require('../comment/comment');
var board = require('../board/board');

var event_emitter = require('events').EventEmitter;
var alert = require('../alert/alert');

var self = module.exports = {
	authed : function(req, res) {
		user_db.connectUserDB();
		var model = user_db.tossUserModel();
		var password = req.body.mypage_password;
		var id = req.session.user.Id;
		
		model.findOne({Id:id}, function(err, docs) {
			if(!err){
				if(docs.password === password) {
					self.inform_page(req, res);
				}//end of if
				else {
					self.index_page(req, res);
				}//end of else
			}
		});//end of findOne;
	}//end of authed
	
	,update : function(req, res) {
		user_db.connectUserDB();
		var model = user_db.tossUserModel();
		var id = req.body.mypage_id,
			password = req.body.mypage_password || req.session.user.password,
			confirm = req.body.mypage_confirm || req.session.user.password,
			name = req.body.mypage_name,
			email = req.body.mypage_email;
		
		var user = {
			 mypage_password : password
			,mypage_name : name
			,mypage_confirm : confirm
			,mypage_email : email
		};
			
		var condition = { Id : id };
		var update = { password : password
						,name : name
						,email : email };
						
		var evt = new event_emitter();
		evt.on('update', function(error_code) {
			switch(error_code) {
				case 0:
					model.update(condition, update, null, function(err) {
						if(!err){
							req.session.user.name = name;
							req.session.user.password = password;
							req.session.user.email = email;
							self.inform_page(req, res);
						}//end of if
						else {
							console.log('mypage.js, update : error');
						}//end of else
					});//end of update
					break;
				case 1:
					alert_script = alert.makeAlert("빈 칸이 있습니다.");
					res.render(language+'/'+'alert',{
						title : 'error',
						alert : alert_script
					});
					break;
				case 2:
					alert_script = alert.makeAlert("비밀번호가 일치하지 않습니다.");
					res.render(language+'/'+'alert',{
						title : 'error',
						alert : alert_script
					});
					break;
				case 3:
					alert_script = alert.makeAlert("비밀번호는 8~15자, 영문 및 숫자 조합으로 만들어 주시기 바랍니다.");
					res.render(language+'/'+'alert',{
						title : 'error',
						alert : alert_script
					});
					break;
				case 4:
					alert_script = alert.makeAlert("유효한 e-Mail 양식이 아닙니다. (ooo@ooo.oo)");
					res.render(language+'/'+'alert',{
						title : 'error',
						alert : alert_script
					});
					break;
				case 5:
					alert_script = alert.makeAlert("이름은 3~15자로, '.', '-', '_' 이상 세 가지의 특수문자만 허용됩니다.");
					res.render(language+'/'+'alert',{
						title : 'error',
						alert : alert_script
					});
					break;				
			}//end of switch
		});
		
		self.check_update_condition(user, evt);		
	}//end of update
	
	,check_update_condition : function(user, evt) {
		var regular_expression_id = /^[0-9a-zA-Z]{4,15}$/;
		var regular_expression_email = /^([0-9a-zA-Z._-]+)@([0-9a-zA-Z_-]+)(\.[a-zA-Z0-9]+)(\.[a-zA-Z]+)?$/;
		var regular_expression_password = /^(?=([a-zA-Z]+[0-9]+[a-zA-Z0-9]*|[0-9]+[a-zA-Z]+[a-zA-Z0-9]*)$).{8,15}/;
		var regular_expression_name = /^[가-힣0-9a-zA-Z._-]{3,15}$/;
		var error_code = 0;
		console.log('in mypage.js, update : password : ' + user.mypage_password + ' -- confirm : ' + user.mypage_confirm);
		if ( user.mypage_name == "" || user.mypage_email == "" ) {
			error_code = 1;
			console.log('in mypage.js _ check_update_condition _ if (1)');
			evt.emit('update', error_code);			
		}//end of if
		else if ( user.mypage_password != user.mypage_confirm ) {
			console.log('in mypage.js _ check_update_condition _ else if (2)');
			error_code = 2;
			evt.emit('update', error_code);
		}
		else if ( !regular_expression_password.test(user.mypage_password) ) {
			console.log('in mypage.js _ check_update_condition _ else if (3)');
			error_code = 3;
			evt.emit('update', error_code);
		}
		else if ( !regular_expression_email.test(user.mypage_email) ) {
			console.log('in mypage.js _ check_update_condition _ else if (4)');
			error_code = 4;
			evt.emit('update', error_code);
		}
		else if ( !regular_expression_name.test(user.mypage_name) ) {
			console.log('in mypage.js _ check_update_condition _ else if (5)');
			error_code = 5;
			evt.emit('update', error_code);
		}
		else {
			console.log('in mypage.js _ check_update_condition _ else(1)');
			evt.emit('update', error_code);
		}
	}
	
	
	,index_page : function(req, res) {
		res.render(language+'/'+'mypage/auth', {
			 title : '비밀번호'
			,session : req.session.user, cookie_id: req.cookies.id
			,authed : 0
		});//end of render
	}//end of index_page
	
	,inform_page : function(req, res) {
		user_db.connectUserDB();
		var model = user_db.tossUserModel();
		var id = req.session.user.Id;
		var authed = 0;
		if(req.session.user) {
			authed = 101;
		}

		model.findOne({Id:id}, function(err, docs) {
			if(!err) {
				res.render(language+'/'+'mypage/inform', {
					 title : '회원정보수정'
					,session : req.session.user, cookie_id: req.cookies.id
					,authed : authed
					,user : docs 
				});//end of render
			}//end of if
			else {
				console.log('in mypage.js, inform_page : error');
			}//end of else
		});//end of findOne;
	}//end of inform_page
	
	,recent_docs_page : function(req, res) {
		board_db.connect();
		var model = board_db.get_model();
		var id = req.session.user.Id;
		var current_page = req.body.page || 1;
		var paging_size = 10;
		var skip_size = (current_page * paging_size) - paging_size;
		var authed = 0;
		
		var evt = new event_emitter();
		var comm_count  = new Array();
		var board_name = new Array();
		var i = 0;
		
		if(req.session.user) {
			authed = 101;
		}
				
		model.find({user_id:id, deleted:false}).sort('insert_date', -1)
					.skip(skip_size).limit(paging_size).exec(function(err, docs){
			if(!err) {
				
				evt.on('comm_count', function(evt, i) {
					if(i < docs.length) {
						comment.counter(docs[i].index, function(result){
							board.get_board_name(docs[i].board_id, function(name_result){
								board.getSubject(docs[i].subject, 60, function(subject_result){
									comm_count[i] = result;
									board_name[i] = name_result;
									docs[i].subject = subject_result;
									evt.emit('comm_count', evt, ++i);
								});//end of getSubject
							});
						});//end of counter
					}//end of if
					else{
						model.count({user_id : id, deleted : false}, function(err, length){
							if(!err){
								res.render(language+'/'+'mypage/recent_docs', {
									 title : '작성 글 목록'
									,session : req.session.user, cookie_id: req.cookies.id
									,authed : authed
									,current_page : current_page
									,docs : docs
									,paging : paging_size
									,length : length
									,comm_number : comm_count
									,board_name : board_name
								});//end of render
							}//end of if
							else {
								console.log('in mypage.js, recent_docs_page : error(02)');
							}//end of else
						});//end of count
					}//end of else
				});//end of evt on
				
				evt.emit('comm_count', evt, i);				
			}//end of if
			else {
				console.log('in mypage.js, recent_docs_page : error(01)');
			}//end of else
		});//end of find
	}//end of inform_page
	
	,recent_comm_page : function(req, res) {
		comment_db.connect();
		var model = comment_db.get_model();
		var id = req.session.user.Id;
		var current_page = req.body.page || 1;
		var paging_size = 10;
		var skip_size = (current_page * paging_size) - paging_size;
		var authed = 0;
		
		var evt = new event_emitter();
		var post_subject  = new Array();
		var board_name = new Array();
		var i = 0;
		
		
		if(req.session.user) {
			authed = 101;
		}
		
		model.find({user_id:id, deleted:false}).sort('insert_date', -1)
					.skip(skip_size).limit(paging_size).exec(function(err, docs){
			if(!err) {
				evt.on('get_post_inform', function(evt, i) {
					if(i < docs.length) {
						board.get_post_subject(docs[i].post_index, function(subject){
							board.get_board_name(docs[i].board_id, function(name){
								board.getSubject(subject, 60, function(short_subject){
									board.getSubject(docs[i].content, 60, function(short_content){
										post_subject[i] = short_subject;
										board_name[i] = name;
										docs[i].content = short_content;
										evt.emit('get_post_inform', evt, ++i);	
									});
								});
								
							});
						});//end of counter
					}//end of if
					else{
						model.count({user_id:id, deleted:false}, function(err, length){
							if(!err){						
								res.render(language+'/'+'mypage/recent_comm', {
									 title : '작성 댓글 목록'
									,session : req.session.user, cookie_id: req.cookies.id
									,authed : authed
									,current_page : current_page
									,docs : docs
									,paging : paging_size
									,length : length
									,board_name : board_name
									,post_subject : post_subject
								});//end of render
							}//end of if
							else {
								console.log('in mypage.js, recent_docs_page : error(02)');
							}//end of else
						});//end of count
					}//end of else
				});//end of evt on
				
				evt.emit('get_post_inform', evt, i);
			}//end of if
			else {
				console.log('in mypage.js, recent_docs_page : error(01)');
			}//end of else
		});//end of find
	},//end of inform_page
	
	mypage_welcome : function(req, res){
		res.render(language+'/'+'welcome', {
			title : '환영 합니다 !'
		});
	}
	
};//end of module export