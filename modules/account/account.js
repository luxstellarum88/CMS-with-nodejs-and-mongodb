/*
	2012. 07. 14. by JH.
	merge makeaccount + users
*/

var dbModel = require('../Database/ConnectDB');
var alert = require('../alert/alert');
var event_emitter = require('events').EventEmitter;


dbModel.connectUserDB();

var self = module.exports =  {
	init : function() {
	}, //end of init
	
	logout : function(req,res) {
		if ( req.session.user ) {
			req.session.user = "";
		}
		res.redirect('/');
	}, //end of logout

	sign_up_page : function(req, res) {
		res.render('join', {
			title: '회원가입'
			, session: req.session.user, cookie_id: req.cookies.id
		});
	}, //end of sign_up
	
	check_id : function(req, res) {
		var regular_expression_id = /^[0-9a-zA-Z]{4,15}$/;
		var id = req.body.ajax_id_form;
		var model = dbModel.tossUserModel();
		
		model.count({Id:id}, function(err, count){
			if ( count ) {
					res.writeHead(200, {'content-type':'text/json'});
					res.write(JSON.stringify({content:'동일한 아이디가 존재합니다.', color : 'red'}));
					res.end('\n');
				//있을때
			}
			else {
				if(regular_expression_id.test(id)) {
					res.writeHead(200, {'content-type':'text/json'});
					res.write(JSON.stringify({content:'사용가능합니다.', color : 'green'}));
					res.end('\n');
				}//end of if
				else {
					res.writeHead(200, {'content-type':'text/json'});
					res.write(JSON.stringify({content:'올바르지 않은 양식입니다(4~15자리, 알파벳+숫자).', color : 'red'}));
					res.end('\n');
				} // end of else
			}
		})	;//end of count
	},//end of check_id
	
	check_password : function(req, res) {
		var regular_expression_password = /^(?=([a-zA-Z]+[0-9]+[a-zA-Z0-9]*|[0-9]+[a-zA-Z]+[a-zA-Z0-9]*)$).{8,15}$/;
		var password = req.body.ajax_password_form;
		if(regular_expression_password.test(password)) {
			res.writeHead(200, {'content-type':'text/json'});
			res.write(JSON.stringify({content:'올바른 양식입니다.', color : 'green'}));
			res.end('\n');
		}//end of if
		else {
			res.writeHead(200, {'content-type':'text/json'});
			res.write(JSON.stringify({content:'올바르지 않은 양식입니다(8~15자리, 알파벳과 숫자의 조합).', color : 'red'}));
			res.end('\n');
		} // end of else
	},
	
	check_name : function(req, res) {
		var regular_expression_name = /^[가-힣0-9a-zA-Z._-]{3,15}$/;
		var name = req.body.ajax_name_form;
		if(regular_expression_name.test(name)) {
			res.writeHead(200, {'content-type':'text/json'});
			res.write(JSON.stringify({content:'올바른 양식입니다.', color : 'green'}));
			res.end('\n');
		}//end of if
		else {
			res.writeHead(200, {'content-type':'text/json'});
			res.write(JSON.stringify({content:'올바르지 않은 양식입니다(3~15자리, 한글/알파벳/숫자/특수문자(-/_/.)).', color : 'red'}));
			res.end('\n');
		} // end of else
	},
	
	check_email : function(req, res) {
		var regular_expression_email = /^([0-9a-zA-Z._-]+)@([0-9a-zA-Z_-]+)(\.[a-zA-Z0-9]+)(\.[a-zA-Z]+)?$/;
		var email = req.body.ajax_email_form;
		if(regular_expression_email.test(email)) {
			res.writeHead(200, {'content-type':'text/json'});
			res.write(JSON.stringify({content:'올바른 양식입니다.', color : 'green'}));
			res.end('\n');
		}//end of if
		else {
			res.writeHead(200, {'content-type':'text/json'});
			res.write(JSON.stringify({content:'올바르지 않은 양식입니다(예) goorm@skima.co.kr).', color : 'red'}));
			res.end('\n');
		} // end of else
	},
	
	check_sign_up_condition : function(user, evt) {
		var regular_expression_id = /^[0-9a-zA-Z]{4,15}$/;
		var regular_expression_email = /^([0-9a-zA-Z._-]+)@([0-9a-zA-Z_-]+)(\.[a-zA-Z0-9]+)(\.[a-zA-Z]+)?$/;
		var regular_expression_password = /^(?=([a-zA-Z]+[0-9]+[a-zA-Z0-9]*|[0-9]+[a-zA-Z]+[a-zA-Z0-9]*)$).{8,15}/;
		var regular_expression_name = /^[가-힣0-9a-zA-Z._-]{3,15}$/;
		var error_code = 0;
		
		if ( user.idForm == "" || user.pwForm == "" || user.nameForm == "" || user.confirmForm == "" || user.emailForm == "" ) {
			error_code = 1;
			evt.emit('sign_up', error_code);
			console.log('in account.js _ check_sign_up_condition _ if (1)');
		}//end of if
		else if ( !regular_expression_id.test(user.idForm) ) {
			error_code = 2
			console.log('in account.js _ check_sign_up_condition _ else if (1)');
			evt.emit('sign_up', error_code);
		}
		else if ( user.pwForm != user.confirmForm ) {
			console.log('in account.js _ check_sign_up_condition _ else if (2)');
			error_code = 3;
			evt.emit('sign_up', error_code);
		}
		else if ( !regular_expression_password.test(user.pwForm) ) {
			console.log('in account.js _ check_sign_up_condition _ else if (3)');
			error_code = 4;
			evt.emit('sign_up', error_code);
		}
		else if ( !regular_expression_email.test(user.emailForm) ) {
			console.log('in account.js _ check_sign_up_condition _ else if (4)');
			error_code = 5;
			evt.emit('sign_up', error_code);
		}
		else if ( !regular_expression_name.test(user.nameForm) ) {
			console.log('in account.js _ check_sign_up_condition _ else if (5)');
			error_code = 6;
			evt.emit('sign_up', error_code);
		}
		else {
			console.log('in account.js _ check_sign_up_condition _ else(1)');
			evt.emit('sign_up', error_code);
		}
	},
	
	check_overlap : function(req, res) {
		var user_id = req.body.ajax_id_form;
		var model = dbModel.tossUserModel();
		
		model.count({Id:user_id}, function(err, count){
			if ( count ) {
					res.writeHead(200, {'content-type':'text/json'});
					res.write(JSON.stringify({content:'동일한 아이디가 존재합니다.', color : 'red'}));
					res.end('\n');
				//있을때
			}
			else {
					res.writeHead(200, {'content-type':'text/json'});
					res.write(JSON.stringify({content:'중복되는 아이디가 없습니다.', color : 'green'}));
					res.end('\n');
				//없을때
			}
		})	;//end of count	
	},//end of check_overlap
	
	insert : function(req, res){
		var useridentity = dbModel.makeUserModel();
		var user = req.body;
		var user_model = dbModel.tossUserModel();
		var evt = new event_emitter();
		var alert_script;
			
		evt.on('sign_up', function(error_code) {
			console.log('in account.js :' +error_code);
			switch ( error_code ) {
				case 0:
					user_model.count({Id:user.idForm}, function(err, docs){
						if ( 0 === docs ) {
							useridentity.Id = user.idForm;
							useridentity.password = user.pwForm;
							useridentity.name = user.nameForm;
							useridentity.email = user.emailForm;
							useridentity.role = 'Guest';
							
							useridentity.save(function(err){
								if ( !err ) {
									console.log('User_inser_success');
									self.authenticate(user.idForm, user.pwForm, function(user){			
										if ( user ) {
											req.session.user = user;
											res.redirect('/');
										}
									});//end of authenticate
								}								
								else
									res.redirect('/');
							});//end of save
						}//end of if
						else {
							var alert_script = alert.makeAlert("이미 존재하는 ID입니다.");
							res.render('alert',{
								title : 'error',
								alert : alert_script
							});
						}
					}); //end of userModel.count
				break;
				
				case 1:
					alert_script = alert.makeAlert("빈 칸이 있습니다.");
					res.render('alert',{
						title : 'error',
						alert : alert_script
					});
				break;
				
				case 2:
					alert_script = alert.makeAlert("아이디는 4~15자, 영문 및 숫자 조합으로 만들어 주시기 바랍니다.");
					res.render('alert',{
						title : 'error',
						alert : alert_script
					});
				break;
				
				case 3:
					alert_script = alert.makeAlert("비밀번호가 일치하지 않습니다.");
					res.render('alert',{
						title : 'error',
						alert : alert_script
					});
				break;
				
				case 4:
					alert_script = alert.makeAlert("비밀번호는 8~15자, 영문 및 숫자 조합으로 만들어 주시기 바랍니다.");
					res.render('alert',{
						title : 'error',
						alert : alert_script
					});
				break;
				
				case 5:
					alert_script = alert.makeAlert("유효한 e-Mail 양식이 아닙니다. (ooo@ooo.oo)");
					res.render('alert',{
						title : 'error',
						alert : alert_script
					});
				break;
				
				case 6:
					alert_script = alert.makeAlert("이름은 3~15자로, '.', '-', '_' 이상 세 가지의 특수문자만 허용됩니다.");
					res.render('alert',{
						title : 'error',
						alert : alert_script, cookie_id: req.cookies.id
					});
				break;
			}//end of switch						
		});//end of evt
		
		self.check_sign_up_condition (user, evt);	
	}, //end of insert
	
	display_userlist : function(type, content, current_page, length, docs, paging_size, req, res) {
		res.render('admin/userlist', {
			title : "회원 리스트"
			,session: req.session.user
			,result : docs
			,type : type
			,content : content
			,current_page : current_page
			,length : length
			,paging_size : paging_size
		});
	},//end of display_userlist

	list : function(req, res) {
		var user_model = dbModel.tossUserModel();
		var current_page = req.params.page || 1;
		var content = req.query.content || "";
		var type = req.query.type || "";
		var paging_size = 20;
		var skip_size = (current_page * paging_size) - paging_size;
			
		content_reg_exp = new RegExp(content, 'i');
			
		if ( 'role' === type ) { //type role ... select box가 나오도록 디자인
			user_model.find({role : content_reg_exp}).skip(skip_size).limit(paging_size).exec(function(err, docs) {
				user_model.find({role : content_reg_exp}).count(function(err, length) {
					if ( !err ) {	
						self.display_userlist(type, content, current_page, length, docs, paging_size, req, res);
					}
					else {
						console.log("error -_-?");
					}
				});
			});
		}
		else if ( 'name' === type ) { //type name
			user_model.find({name : content_reg_exp}).skip(skip_size).limit(paging_size).exec(function(err, docs) {
				user_model.find({name : content_reg_exp}).count(function(err, length) {
					if ( !err ) {	
						self.display_userlist(type, content, current_page, length, docs, paging_size, req, res);
					}
					else {
						console.log("error -_-?");
					}			
				});
			});
		}
		else if ( 'id' === type ) { //type id
			user_model.find({Id : content_reg_exp}).skip(skip_size).limit(paging_size).exec(function(err, docs) {
				user_model.find({Id : content_reg_exp}).count(function(err, length) {
					if ( !err ) {	
						self.display_userlist(type, content, current_page, length, docs, paging_size, req, res);
					}
					else {
						console.log("error -_-?");
					}	
				});
			});
		}
		else { //type default
			user_model.find({}).skip(skip_size).limit(paging_size).exec(function(err, docs) {
				user_model.find({}).count(function(err, length) {
					if ( !err ) {	
						self.display_userlist(type, content, current_page, length, docs, paging_size, req, res);
					}
					else {
						console.log("error -_-?");
					}	
				});
			});
		}
	}, //end of list
	
	authenticate : function (id, password, callback){
		var user_model = dbModel.tossUserModel();	
		// login, password filtering
		user_model.findOne({Id: id}, function(err, user){
			if ( user ) {
				if ( user.password == password ) {
					callback(user);				
				}
				else {
					callback(null);
				}				
			}
			else {
				callback(null);
			}			
		});//end of usermodel findOne callback
	}, //end of authenticate
	
	information : function(user_id, req, res) {
		var user_model = dbModel.tossUserModel();
		user_model.findOne({Id:user_id}, function(err, user){
			if ( user ) {
				res.render('admin/userinformation', {
					title : '회원 정보'
					, session: req.session.user
					, info : user, cookie_id: req.cookies.id
				});//end of render
			}//end of if
			else {
				console.log('unexpected error');
				res.redirect('admin/userlists');
			}
		});//end of query
	}, //end of information
	
	modify : function(user_info, res){
		var user_model = dbModel.tossUserModel();
		var condition = { Id : user_info.user_id };
		var update = { role : user_info.user_role };
		
		user_model.update(condition, update, null, function(err) {
			if ( !err ) {
				console.log('user info update success');
				res.redirect('/user_information/'+user_info.user_id);
			}//end of if
			else {
				console.log('unexpected error');
				res.redirect('admin/userlists/1');
			}
		});//end of update
	}, //end of modify
	
	session : function(req, res) {
		self.authenticate(req.body.id, req.body.password, function(user){
			console.log('hello : ' + user);
			if ( user ) {
				var url = req.body.url || '/';
				req.session.user = user;
				res.cookie("id", req.body.id);
				res.redirect(url);
			}
			else {
				var alert_script = alert.makeAlert('존재하지 않는 계정이거나 계정 정보가 잘못되었습니다.');
				res.render('alert',{
					title : 'error'
					,alert : alert_script
				});
			}
		});
	},//end of session
	
	show_index_page : function (req, res) {
		var board = require('../board/board');
		var evt = new event_emitter();
				
		evt.on('get_board_data', function(evt){
			board.get_board_data('notice', 5, function(notice_result) {
				if('error' != notice_result) {
					board.get_board_data('news', 5, function(news_result) {
						if('error' != news_result) {
							var notice = notice_result;
							var news = news_result;
							evt.emit('show_index', notice, news);
						}//end of if
						else {
							console.log('in account.js, show_index_page : get news data error(01)');
						}//end of else
					});//end of get_board_data(news)
				}//end of if
				else {
					console.log('in account.js, show_index_page : get notice data error(01)');
				}//end of else
			});//end of get_board_data(notice)
		});//end of evt.on(get_board_data)
		
		evt.on('show_index', function(notice, news) {
			res.render('index',{
				title : 'goorm'
				, session : req.session.user
				, notice : notice
				, news : news, cookie_id: req.cookies.id
			});//end of render	
		});//end of evt.on
		
		evt.emit('get_board_data', evt);
	}//end of show_index_page
}//end of export