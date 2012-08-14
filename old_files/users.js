
var dbModel = require('../Database/ConnectDB');
dbModel.connectUserDB();

/*
type에 따른 search와 paging 기능을 만들겁니다. paging은 한 번에 20명씩 보이도록 해볼게요.
2012. 7. 9. 시작. JH 
2012.7.9. ver1.0 완료
*/
	

function display_userlist(type, content, current_page, length, docs, paging_size, res) {
	res.render(language+'/'+'admin/userlist', {
		title : "UserList"
		,result : docs
		,type : type
		,content : content
		,current_page : current_page
		,length : length
		,paging_size : paging_size
	});
}


exports.allUser = function(type, content, current_page, res){
	var user_model = dbModel.tossUserModel();
	var paging_size = 20;
	var skip_size = (current_page * paging_size) - paging_size;
	content_reg_exp = new RegExp(content, 'i');
	
	
	if('role' === type) { //type role ... select box가 나오도록 디자인
		user_model.find({role : content_reg_exp}).skip(skip_size).limit(paging_size).exec(function(err, docs) {
			user_model.find({role : content_reg_exp}).count(function(err, length) {
				if(!err) {	
					display_userlist(type, content, current_page, length, docs, paging_size, res);
				}
				else{
					console.log("error -_-?");
				}
			});
		});
	}
	else if('name' === type) { //type name
		user_model.find({name : content_reg_exp}).skip(skip_size).limit(paging_size).exec(function(err, docs) {
			user_model.find({name : content_reg_exp}).count(function(err, length) {
				if(!err) {	
					display_userlist(type, content, current_page, length, docs, paging_size, res);
				}
				else{
					console.log("error -_-?");
				}			
			});
		});
	}
	else if('id' === type) { //type id
		user_model.find({Id : content_reg_exp}).skip(skip_size).limit(paging_size).exec(function(err, docs) {
			user_model.find({Id : content_reg_exp}).count(function(err, length) {
				if(!err) {	
					display_userlist(type, content, current_page, length, docs, paging_size, res);
				}
				else{
					console.log("error -_-?");
				}	
			});
		});
	}
	else { //type default
		user_model.find({}).skip(skip_size).limit(paging_size).exec(function(err, docs) {
			user_model.find({}).count(function(err, length) {
				if(!err) {	
					display_userlist(type, content, current_page, length, docs, paging_size, res);
				}
				else{
					console.log("error -_-?");
				}	
			});
		});
	}
}

module.exports.authenticate = function(id, password, callback){
	var UserModel = dbModel.tossUserModel();	
	// login, password filtering
	
	UserModel.findOne({Id: id}, function(err, user){
		if(user){
			if(user.password == password){
				callback(user);				
			}
			else{
				callback(null);
			}				
		}
		else{
			callback(null);
		}			
	});//end of usermodel findOne callback
};

exports.user_information = function(user_id, res) {
	var user_model = dbModel.tossUserModel();
	user_model.findOne({Id:user_id}, function(err, user){
		if( user ) {
			res.render(language+'/'+'admin/userinformation', {
				title : 'User_Information'
				, info : user
			});//end of render
		}//end of if
		else{
			console.log('unexpected error');
			res.redirect('admin/userlist');
		}
		
	});//end of query
}

exports.user_modify = function(user_info, res){
	var user_model = dbModel.tossUserModel();
	var condition = { Id : user_info.user_id };
	var update = { role : user_info.user_role };
	console.log(condition);
	console.log(update);
	user_model.update(condition, update, null, function(err) {
		if(!err) {
			console.log('user info update success');
			res.redirect('/user_information?id='+user_info.user_id);
		}//end of if
		else{
			console.log('unexpected error');
			res.redirect('admin/userlist');
		}
	});//end of update
}
