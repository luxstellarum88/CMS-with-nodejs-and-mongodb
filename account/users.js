
var dbModel = require('../Database/ConnectDB');
dbModel.connectUserDB();

exports.allUser = function(req, res){
	var UserModel = dbModel.tossUserModel();

	UserModel.find({}, [], function(err, docs){
		if(!err){
			res.render('admin/userlist', {
				title: 'userlist',
				result: docs
			});			
		}
		else{
			res.redirect('/');
		}
	})
}

module.exports.authenticate = function(id, password, callback){
	var UserModel = dbModel.tossUserModel();	
	// login, password filtering
	
	UserModel.findOne({Id: id}, function(err, user){
		if(user){
			if(user.password == password){
				console.log('hello password');
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
			res.render('admin/userinformation', {
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
