var config = {
	txHost: '', /* 런타임 시 리소스들을 로딩할 때 필요한 부분으로, 경로가 변경되면 이 부분 수정이 필요. ex) http://xxx.xxx.com */
	txPath: '', /* 런타임 시 리소스들을 로딩할 때 필요한 부분으로, 경로가 변경되면 이 부분 수정이 필요. ex) /xxx/xxx/ */
	txService: 'sample', /* 수정필요없음. */
	txProject: 'sample', /* 수정필요없음. 프로젝트가 여러개일 경우만 수정한다. */
	initializedId: "", /* 대부분의 경우에 빈문자열 */
	wrapper: "tx_trex_container", /* 에디터를 둘러싸고 있는 레이어 이름(에디터 컨테이너) */
	form: 'tx_editor_form'+"", /* 등록하기 위한 Form 이름 */
	txIconPath: "/lib/daumeditor-7.3.19/images/icon/editor/", /*에디터에 사용되는 이미지 디렉터리, 필요에 따라 수정한다. */
	txDecoPath: "/lib/daumeditor-7.3.19/images/deco/contents/", /*본문에 사용되는 이미지 디렉터리, 서비스에서 사용할 때는 완성된 컨텐츠로 배포되기 위해 절대경로로 수정한다. */
	canvas: {
		styles: {
			color: "#123456", /* 기본 글자색 */
			fontFamily: "굴림", /* 기본 글자체 */
			fontSize: "10pt", /* 기본 글자크기 */
			backgroundColor: "#fff", /*기본 배경색 */
			lineHeight: "1.5", /*기본 줄간격 */
			padding: "8px" /* 위지윅 영역의 여백 */
		},
		showGuideArea: false
	},
	events: {
		preventUnload: false
	},
	sidebar: {
		attacher:{
			image:{
			},
			file:{
				boxonly: true
			}
		},
		attachbox: {
			show: true
		},
		capacity: {
			maximum: 15 * 1024 * 1024
		}
	},
	size: {
		contentWidth: 700 /* 지정된 본문영역의 넓이가 있을 경우에 설정 */
	}
};

/**
 * Editor.save()를 호출한 경우 데이터가 유효한지 검사하기 위해 부르는 콜백함수로
 * 상황에 맞게 수정하여 사용한다.
 * 모든 데이터가 유효할 경우에 true를 리턴한다.
 * @function
 * @param {Object} editor - 에디터에서 넘겨주는 editor 객체
 * @returns {Boolean} 모든 데이터가 유효할 경우에 true
 */
function validForm(editor) {
	// Place your validation logic here

	// sample : validate that content exists
	var validator = new Trex.Validator();
	var content = editor.getContent();
	if (!validator.exists(content)) {
		alert('내용을 입력하세요');
		return false;
	}

	return true;
}

/**
 * Editor.save()를 호출한 경우 validForm callback 이 수행된 이후
 * 실제 form submit을 위해 form 필드를 생성, 변경하기 위해 부르는 콜백함수로
 * 각자 상황에 맞게 적절히 응용하여 사용한다.
 * @function
 * @param {Object} editor - 에디터에서 넘겨주는 editor 객체
 * @returns {Boolean} 정상적인 경우에 true
 */
function setForm(editor) {
	var formGenerator = editor.getForm();
	var content = editor.getContent();
	formGenerator.createField(
			tx.textarea({
				'name': "tx_content", // 본문 내용을 필드를 생성하여 값을 할당하는 부분
				'style': { 'display': "none" }
			}, content)
	);
	/* 아래의 코드는 첨부된 데이터를 필드를 생성하여 값을 할당하는 부분으로 상황에 맞게 수정하여 사용한다.
	 첨부된 데이터 중에 주어진 종류(image,file..)에 해당하는 것만 배열로 넘겨준다. */
	var images = editor.getAttachments('image');
	for (var i = 0, len = images.length; i < len; i++) {
		// existStage는 현재 본문에 존재하는지 여부
		if (images[i].existStage) {
			formGenerator.createField(
				tx.input({
					'type': "hidden",
					'name': 'tx_attach_image',
					'value': images[i].data.imageurl // 예에서는 이미지경로만 받아서 사용
				})
			);
		}
	}
	var files = editor.getAttachments('file', true);
	for (var i = 0, len = files.length; i < len; i++) {
		formGenerator.createField(
				tx.input({
					'type': "hidden",
					'name': 'tx_attach_file',
					'value': files[i].data.attachurl
				})
		);
	}
	return true;
}