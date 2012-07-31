var db = require('../Database/ConnectDB');
var email = require('../admin/admin');
var event_emitter = require('events').EventEmitter;
var alert = require('../alert/alert');

db.connectUserDB();

var self = module.exports = {
	init : function(){
	}//end of init
	
	,find_id_page : function(req, res) {
		res.render('find_account/find_id', {
			title : '아이디 찾기' 
			,session : req.session.user
		});
	}//end of find_id_page
	
	,find_password_page : function(req, res) {
		res.render('find_account/find_password', {
			title : '비밀번호 찾기' 
			,session : req.session.user
		});
	}//end of find_password_page
	
	,find_id_result_page : function(req, res) {
		self.find_id(req.body.email, function(result) {
			if(result != false) {
				res.render('find_account/id_result', {
					title : '아이디 찾기 결과'
					,result : result 
					,session : req.session.user
				});//end of render
			}//end of if
			else {
				var alert_script = alert.makeAlert('일치하는 계정 정보가 없습니다.');
				res.render('alert',{
					title : 'error'
					,alert : alert_script
					,session : req.session.user
				});
			}//end of else
		});//end of find
	}//end of find_id_result_page
	
	,find_password_result_page : function(req, res) {
		self.find_password(req.body.id, req.body.email, function(result) {
			if(result != false) {
				res.render('find_account/password_result', {
					title : '비밀번호 찾기 결과' 
					,session : req.session.user
				});//end of render
			}//end of if
			else {
				var alert_script = alert.makeAlert('일치하는 계정 정보가 없습니다.');
				res.render('alert',{
					title : 'error'
					,alert : alert_script
					,session : req.session.user
				});//end of render
			}//end of else
		});//end of find_password
		
	} //end of find_password_result_page
	
	,find_id : function(user_email, callback) {
		var model = db.tossUserModel();
		model.findOne( {email : user_email}, function( err, result ) {
			if(!err) {
				if(result) {
					callback(result.Id);
				}
				else {
					callback(false);
				}
			}//end of if
			else {
				console.log('in find_account.js, find_id : error(01)');
			}//end of else
		});//end of findOne
	}//end of find_id
	
	,find_password : function(user_id, user_email, callback) {
		var model = db.tossUserModel();
		var sender = 'luxstellarum@skima.co.kr';
		var subject = '[구름] 임시 비밀번호';
		var content = '귀하의 구름 사이트 임시 비밀번호는 : ';
		model.findOne( {Id : user_id, email : user_email}, function(err, result) {
			if(!err){
				if(result) {
					self.make_password(function(str) {
						console.log('in find_account.js, find password str : ' + str );
						var condition = {Id:user_id, email : user_email};
						var update = {password : str};
						content = content + str + '입니다.';
						model.update(condition, update, null, function(err){
							if(!err){
								email.send_mail(sender, user_email, subject, content);
								callback(true);
							}//end of if
							else{
								console.log('in find_accout.js, find_password : error(03)');								
							}//end of else
						});//end of update
					});//end of make_password
				}//end of if
				else {
					callback(false);					
				}//end of else
			}//end of ifhttp://thyword.egloos.com/1368032
			else {
				console.log('in find_accout.js, find_password : error(02)');
			}//end of else
		});//end of findOne
	}//end of find_password
	
	,make_password : function(callback) {
		var characters = "abcdefghizklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		var selector = 0;
		
		var result = "";
		var evt = new event_emitter();
		var max_length = 10;
		var i=0;
		console.log('in find_account.js, make_password : 01, result : ' + result);
		
		evt.on('password_maker', function(evt, i){
			console.log('in find_account.js, make_password : 02');
			if(i < max_length) {
				console.log('in find_account.js, make_password : 03');
				self.make_random_number(0, characters.length, function(num) {
					console.log('in find_account.js, make_password : 05' + ' ' + num);
					result = result + characters[num];
					evt.emit('password_maker', evt, ++i);
				}); //end of make_random_string
			}//end of if
			else {
				callback(result);
			}//end of else
		});//end of evt.on
		
		evt.emit('password_maker', evt, i);
		
	}//end of make_password
	
	,make_random_number : function(min, max, callback) {
		console.log('in find_account.js, make_password : 04');
		callback ( Math.floor(Math.random() * (max - min + 1)) + min );
	}//end of make_random_string
}
