exports.main = function(req, res){
	res.render('main', {
		title: 'Goorm'
		 
	});
}

exports.sub1_1 = function(req, res){
	res.render('index', { title: 'Sub1-1' });
}
