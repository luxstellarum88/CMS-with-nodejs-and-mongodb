var self = module.exports = {

	admin_new_index : function(req, res) {
		res.render('admin_new/index', {
			title: 'index'
		});
	},
	admin_new_login : function(req, res) {
		res.render('admin_new/login', {
			title: 'index'
		});
	},
	
	admin_new_common_footer : function(req, res) {
		res.render('admin_new/common/footer', {
			title: 'index'
		});
	},
	admin_new_common_head : function(req, res) {
		res.render('admin_new/common/head', {
			title: 'index'
		});
	},
	admin_new_common_header : function(req, res) {
		res.render('admin_new/common/header', {
			title: 'index'
		});
	},
	admin_new_common_mainMenu : function(req, res) {
		res.render('admin_new/common/mainMenu', {
			title: 'index'
		});
	},
	admin_new_common_subHead : function(req, res) {
		res.render('admin_new/common/subHead', {
			title: 'index'
		});
	},
	
	admin_new_inc_leftMenu : function(req, res) {
		res.render('admin_new/inc/leftMenu', {
			title: 'index'
		});
	},

	admin_new_sub1_1 : function(req, res) {
		res.render('admin_new/sub01/sub01', {
			title: 'index'
		});
	},
	admin_new_sub1_2 : function(req, res) {
		res.render('admin_new/sub01/sub02', {
			title: 'index'
		});
	},
	admin_new_sub2_1 : function(req, res) {
		res.render('admin_new/sub02/sub01', {
			title: 'index'
		});
	},

} // end of module
