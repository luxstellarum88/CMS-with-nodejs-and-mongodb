
function call_confirm_post(context, form_name) {
	if(confirm(context)) {
		form_name.submit();
	}
}

function call_confirm_get(context, parameters) {
	if(confirm(context)) {
		location.href=parameters;
	}
}

	//120710 JH 추가. 삭제시 삭제여부 재확인 스크립트	
	function document_delete_confirm() {
		if(confirm("정말 삭제하시겠습니까?")) {
			location.href='/board_delete?id=#{board_id}&num=#{board.no}';
		}
	}