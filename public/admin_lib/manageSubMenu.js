$(document).ready(function(){
	var path = location.pathname;
	path = path.split("/");
	var menu = "#menu"+path[2].split("sub")[1];
	var subMenu = "#subMenu"+path[2].split("sub")[1]+"-"+path[3].split("sub")[1].split(".")[0];

/* 	$(".wrap-menu-select").removeClass("wrap-menu-select"); */
/* 	$(".subMenu-select").removeClass("subMenu-select"); */
/* 	$(".wrap-subMenu-select").removeClass("wrap-subMenu-select"); */
	
	$(menu).addClass("wrap-menu-select");
	$(subMenu).parent().addClass("subMenu-select");
	$(subMenu).addClass("wrap-subMenu-select");
});