var open_script = '<script type="text/javascript">';
var close_script = '</script>';

exports.makeAlert = function(context, res) {
	var alert_script = open_script + 'alert(\'' + context + '\');history.go(-1);' + close_script;
	return alert_script;
}

//error -_-
exports.makePasswordAlert = function(context, res) {
	var alert_script = '<script type=\'text/javascript\'>alert(\'' + context + '\');window.opener.reload();window.close();</script>'
	eval(alert_script);
}


//make confirm script. post용
exports.makeConfrim = function(context, action, res) {
	var confirm_script = open_script;
	confirm_script += 'if (confirm("승인 하시겠습니까?")){';
	confirm_script += 	action;
	confirm_script += '}else{'
	confirm_script += 'history.go(-1);';
	confirm_script += close_script;
}