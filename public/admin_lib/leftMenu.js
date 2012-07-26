
$(document).ready(function(){
	
	var mainMenuSelect = function() {
		var url = "/admin_new/sub" + $(this).attr("value") + "/sub01";
		location.href=url;
	};
	
	var subMenuSelect = function() {
		var url = "/admin_new/sub" + $(this).parent().parent().children(".wrap-menu").attr("value") + "/sub"+$(this).attr("value")+"";
		location.href = url;
	}; 

	$(".wrap-menu").bind("click",mainMenuSelect);
	$(".wrap-subMenu").bind("click",subMenuSelect);

});