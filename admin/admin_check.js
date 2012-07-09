exports.SuperUserAuth = function(id, password, callback){
	var dbModel = require('../Database/Connect_Admin_DB');
	dbModel.connectSuperUserDB();
	
	var UserModel = dbModel.tossSuperUserModel();

	UserModel.findOne({Id: id}, function(err, user){
		if(user){
			if(user.password == password){
				callback(user);
			}
			else
				callback(null);
		}
		else
			callback(null);
	});
}


exports.AdminAuth = function(id, password, callback){
	var dbModel = require('../Database/ConnectDB');
	dbModel.connectUserDB();

	var UserModel = dbModel.tossUserModel();
	
	// login, password filtering
	UserModel.findOne({Id: id}, function(err, user){
		if(user){
			if(user.password == password && user.role == 'admin'){
				callback(user);
			}
			else
				callback(null);
		}
		else
			callback(null);
	});
};
