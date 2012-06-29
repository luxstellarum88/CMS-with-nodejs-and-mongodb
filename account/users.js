var users = {
	'Hello' : {login: 'nam', password: 'test', role: 'admin'},
	'guest' : {login: 'who', password: 'are', role: 'user'}
};

module.exports.authenticate = function(login, password, callback){
	var user = users[login];
	if(!user){
		callback(null);
		return;
	}
	if(user.password == password){
		callback(user);
		return;
	}
	callback(null);
};
