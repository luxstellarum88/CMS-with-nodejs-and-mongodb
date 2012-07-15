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

exports.AlertRedirect = function(context, url){
	var alert_script = open_script + 'alert(\'' + context + '\');location.href="' + url + '";' + close_script;
	return alert_script;
}