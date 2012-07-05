
var usersModel = require('../account/users');
var dbModel = require('../Database/ConnectDB');

dbModel.connectUserDB();

exports.insertUser = function(req, res){
	var useridentity = dbModel.makeUserModel();
	var user = req.body;
	
	//add at 120704. JH
	var userModel = dbModel.tossUserModel();
	
	userModel.count({Id:user.idForm}, function(err, docs){
		
		console.log(docs);
		if(0 === docs) {
			useridentity.Id = user.idForm;
			useridentity.password = user.pwForm;
			useridentity.name = user.nameForm;
			useridentity.email = user.emailForm;
			useridentity.role = 'Guest';
			
			useridentity.save(function(err){
				if(!err)
					console.log('User_inser_success');
				else
					res.redirect('/');
					
				usersModel.authenticate(user.idForm, user.pwForm, function(user){			
					if(user){
						req.session.user_id = user.Id;
						res.redirect('/board');
					}
					else{
						res.render('sessions/new', {title: 'login', locals : 
							{redir: '/board'}	
						});
					}
				});//end of authenticate		
			});//end of save
		}//end of if
		else{
			console.log('existed ID');
			res.redirect('/');
		}
	});
};
