var super_user_db_model = require('../Database/Connect_Admin_DB');
super_user_db_model.connectSuperUserDB();

/*add 120707. JH*/
exports.authenticate = function(id, password, callback) {
	
	var super_user_model = super_user_db_model.tossSuperUserModel();

	super_user_model.findOne({Id : id}, function(err, user) {
		if(user){
			if(user.password === password) {
				console.log('hello superuser');
				callback(user);
			}
			else{
				callback(null);
			}
		}//end of if
		else{
			callback(null);
		}
	});//end of findOne callback func
}

