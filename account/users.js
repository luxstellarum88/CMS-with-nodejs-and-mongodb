
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
			else
				callback(null);
		}
		else
			callback(null);
	});
};
