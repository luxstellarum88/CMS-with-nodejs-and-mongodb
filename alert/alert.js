/**
 * @author Son Junhong
 */

exports.makeAlert = function(context, res) {
	var alert_script = '<script type=\'text/javascript\'>alert(\'' + context + '\')</script>';
	return alert_script;
}
