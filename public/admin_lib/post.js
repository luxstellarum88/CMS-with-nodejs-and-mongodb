var post_goto = function(url, parm, target){

	var f = document.createElement('form');
	
	var value;
	for (var key in parm) {
		value = parm[key];
		var objs = document.createElement('input');
		objs.setAttribute('type', 'hidden');
		objs.setAttribute('name', key);
		objs.setAttribute('value', value);
		f.appendChild(objs);

	}
	    

	if (target)
		f.setAttribute('target', target);
	
	f.setAttribute('method', 'post');
	f.setAttribute('action', url);
	
	document.body.appendChild(f);
	
	f.submit();


}