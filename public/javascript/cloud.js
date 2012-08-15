	// animation settings
	var goorm_count = 5;		//default = 5, 구름 갯수
	var goorm_speed = .1;		//default = .1, 구름 회전 속도
	var goorm_sensitivity = .2;	//default = 1
	
	
	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelRequestAnimationFrame = window[vendors[x]+
			  'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	}())

	var layers = [],
		objects = [],
		
		world = document.getElementById( 'world' ),
		viewport = document.getElementById( 'viewport' ),
		
		d = 0,
		p = 400,
		worldXAngle = 0,
		worldYAngle = 0;
	
	viewport.style.webkitPerspective = p;
	viewport.style.MozPerspective = p;
	viewport.style.oPerspective = p;
	
	generate();
	
	function createCloud() {
		clientWidth = document.width;
		clientHeight = document.height;

		var div = document.createElement( 'div'  );
		div.className = 'cloudBase';
		
		var x = clientWidth/4 - ( Math.random() * clientWidth/2 );
/* 		var y = 0~clientHeight/2; */
		var y = Math.random() * clientHeight/2;

		var z = 128 - ( Math.random() * 256 );
		var t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px )';
		var d = Math.round(Math.random());

		div.style.webkitTransform = t;
		div.style.MozTransform = t;
		div.style.oTransform = t;
		world.appendChild( div );
		
		for( var j = 0; j < 5 + Math.round( Math.random() * 10 ); j++ ) {
			var cloud = document.createElement( 'img' );
			cloud.style.opacity = 0;
			var r = Math.random();
			var src = '../../images/cloud.png';
			( function( img ) { img.addEventListener( 'load', function() {
				img.style.opacity = .8;
			} ) } )( cloud );
			cloud.setAttribute( 'src', src );
			cloud.className = 'cloudLayer';
			
			var x = 256 - ( Math.random() * 512 );
			var y = 256 - ( Math.random() * 512 );
			var z = 100 - ( Math.random() * 200 );
			var a = Math.random() * 360;
			var s = .25 + Math.random();
			x *= .2; y *= .2;
			cloud.data = { 
				x: x,
				y: y,
				z: z,
				a: a,
				s: s,
				d: d,
				speed: goorm_speed * Math.random()
			};
			var t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px ) rotateZ( ' + a + 'deg ) scale( ' + s + ' )';
			cloud.style.webkitTransform = t;
			cloud.style.MozTransform = t;
			cloud.style.oTransform = t;
		
			div.appendChild( cloud );
			layers.push( cloud );
		}
		
		return div;
	}
	
	window.addEventListener( 'mousewheel', onContainerMouseWheel );
	window.addEventListener( 'DOMMouseScroll', onContainerMouseWheel ); 

	window.addEventListener( 'mousemove', function( e ) {
		worldYAngle = -( .5 - ( e.clientX / window.innerWidth ) ) * 180 * goorm_sensitivity;
		worldXAngle = ( .5 - ( e.clientY / window.innerHeight ) ) * 180 * goorm_sensitivity;
		updateView();
	} );
	
	function generate() {
		objects = [];
		if ( world.hasChildNodes() ) {
			while ( world.childNodes.length >= 1 ) {
				world.removeChild( world.firstChild );       
			} 
		}
		//for( var j = 0; j < 5; j++ ) {
		for( var j = 0; j < goorm_count; j++ ) {
			objects.push( createCloud() );
		}
	}
	
	function updateView() {
		
		var t = 'rotateX( ' + worldXAngle + 'deg) rotateY( ' + worldYAngle + 'deg)';
		world.style.webkitTransform = t;
		world.style.MozTransform = t;
		world.style.oTransform = t;
	}
	
	function onContainerMouseWheel( event ) {
			
		event = event ? event : window.event;
		d = d - ( event.detail ? event.detail * -5 : event.wheelDelta / 8 );
		updateView();
		
	}
	
	function update (){
		
		for( var j = 0; j < layers.length; j++ ) {
			var layer = layers[ j ];
			layer.data.a += layer.data.speed;

			if(layer.data.d==1){
				layer.data.x += layer.data.speed*2;
				if(layer.data.x>document.width/2)
					layer.data.d = 0;

			}
			else{
				layer.data.x -= layer.data.speed*2;
				if(layer.data.x<-document.width/2)
					layer.data.d = 1;
			}

			var t = 'translateX( ' + layer.data.x + 'px ) translateY( ' + layer.data.y + 'px ) translateZ( ' + layer.data.z + 'px ) rotateY( ' + ( - worldYAngle ) + 'deg ) rotateX( ' + ( - worldXAngle ) + 'deg ) rotateZ( ' + layer.data.a + 'deg ) scale( ' + layer.data.s + ')';
			layer.style.webkitTransform = t;
			layer.style.MozTransform = t;
			layer.style.oTransform = t;
		}
		
		requestAnimationFrame( update );
		
	}
	
	update();

	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-625393-26']);
	_gaq.push(['_trackPageview']);
