/**
 * @author Son Junhong
 */

exports.makeAlert = function(context, res) {
	var alert_script = '<script type=\'text/javascript\'>alert(\'' + context + '\');history.go(-1);</script>';
	return alert_script;
}
