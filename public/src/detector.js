// DETECTOR :
dk.makeStatic( 'DETECTOR', ( function( w, doc ) {
	var navi = w.navigator,
		agent = navi.userAgent.toLowerCase(),
		platform = navi.platform.toLowerCase(),
		app = navi.appVersion.toLowerCase(),
		device = 'pc',
		os, osv, browser, bv, flash,
		prefixCss, prefixStyle, transform3D, keyframe = w[ 'CSSRule' ],
		docMode = 0,
		d = doc.createElement( 'div' ),
		s = d.style,
		c = doc.createElement( 'canvas' ),
		a = doc.createElement( 'audio' ),
		v = doc.createElement( 'video' ),
		t0,
		edge, ie, chrome, firefox, safari, opera, naver;

	edge = function() {
			if( agent.indexOf( 'edge' ) < 0 ) return;
			if( agent.indexOf( 'Windows Phone' ) > -1 ) os = 'winMobile';
			return browser = 'edge', bv = 'edge';
		},
		ie = function() {
			if( agent.indexOf( 'msie' ) < 0 && agent.indexOf( 'trident' ) < 0 ) return;
			if( agent.indexOf( 'iemobile' ) > -1 ) os = 'winMobile';
			return browser = 'ie', bv = agent.indexOf( 'msie 7' ) > -1 && agent.indexOf( 'trident' ) > -1 ? -1 : agent.indexOf( 'msie' ) < 0 ? 11 : parseFloat( /msie ([\d]+)/.exec( agent )[ 1 ] );
		},
		chrome = function() {
			if( agent.indexOf( 'opr' ) > -1 || agent.indexOf( 'opera' ) > -1 ) return;
			if( agent.indexOf( t0 = 'chrome' ) < 0 && agent.indexOf( t0 = 'crios' ) < 0 ) return;
			return browser = 'chrome', bv = parseFloat( ( t0 == 'chrome' ? /chrome\/([\d]+)/ : /crios\/([\d]+)/ ).exec( agent )[ 1 ] );
		},
		firefox = function() {
			return agent.indexOf( 'firefox' ) < 0 ? 0 : ( browser = 'firefox', bv = parseFloat( /firefox\/([\d]+)/.exec( agent )[ 1 ] ) );
		},
		safari = function() {
			if( agent.indexOf( 'opr' ) > -1 || agent.indexOf( 'opera' ) > -1 ) return;
			return agent.indexOf( 'safari' ) < 0 ? 0 : ( browser = 'safari', bv = parseFloat( /version\/([\d]+)/.exec( agent )[ 1 ] ) );
		},
		opera = function() {
			var i;
			return( agent.indexOf( i = 'opera' ) < 0 && agent.indexOf( i = 'opr' ) < 0 ) ? 0 : ( browser = 'opera', bv = ( i == 'opera' ) ? parseFloat( /version\/([\d]+)/.exec( agent )[ 1 ] ) : parseFloat( /opr\/([\d]+)/.exec( agent )[ 1 ] ) );
		},
		naver = function() {
			return agent.indexOf( 'naver' ) < 0 ? 0 : browser = 'naver';
		};

	// os, browser
	if( agent.indexOf( 'android' ) > -1 ) {
		browser = os = 'android';
		if( agent.indexOf( 'mobile' ) == -1 ) browser += 'Tablet', device = 'tablet';
		else device = 'mobile';
		if( t0 = /android ([\d.]+)/.exec( agent ) ) t0 = t0[ 1 ].split( '.' ), osv = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] );
		else osv = 0;
		if( t0 = /safari\/([\d.]+)/.exec( agent ) ) bv = parseFloat( t0[ 1 ] );
		naver() || chrome() || opera() || firefox();
	} else if( agent.indexOf( t0 = 'ipad' ) > -1 || agent.indexOf( t0 = 'iphone' ) > -1 ) {
		device = t0 == 'ipad' ? 'tablet' : 'mobile', browser = os = t0;
		if( t0 = /os ([\d_]+)/.exec( agent ) ) t0 = t0[ 1 ].split( '_' ), osv = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] );
		else osv = 0;
		if( t0 = /mobile\/([\S]+)/.exec( agent ) ) bv = parseFloat( t0[ 1 ] );
		naver() || chrome() || opera() || firefox();
	} else {
		if( platform.indexOf( 'win' ) > -1 ) {
			os = 'win', t0 = 'windows nt ';
			if( agent.indexOf( t0 + '5.1' ) > -1 ) osv = 'xp';
			else if( agent.indexOf( t0 + '6.0' ) > -1 ) osv = 'vista';
			else if( agent.indexOf( t0 + '6.1' ) > -1 ) osv = '7';
			else if( agent.indexOf( t0 + '6.2' ) > -1 ) osv = '8';
			else if( agent.indexOf( t0 + '6.3' ) > -1 ) osv = '8.1';
			else if( agent.indexOf( t0 + '10.0' ) > -1 ) osv = '10';
			edge() || ie() || chrome() || firefox() || safari() || opera();
		} else if( platform.indexOf( 'mac' ) > -1 ) {
			os = 'mac', t0 = /os x ([\d._]+)/.exec( agent )[ 1 ].replace( '_', '.' ).split( '.' ), osv = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] ),
				chrome() || safari() || firefox() || opera();
		} else {
			os = app.indexOf( 'x11' ) > -1 ? 'unix' : app.indexOf( 'linux' ) > -1 ? 'linux' : 0, chrome() || firefox();
		}
	}
	// flash
	( function() {
		var plug = navi.plugins,
			t0;
		if( browser == 'ie' ) try { t0 = new ActiveXObject( 'ShockwaveFlash.ShockwaveFlash' ).GetVariable( '$version' ).substr( 4 ).split( ',' ), flash = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] ); } catch( e ) {}
		else if( ( t0 = plug[ 'Shockwave Flash 2.0' ] ) || ( t0 = plug[ 'Shockwave Flash' ] ) ) t0 = t0.description.split( ' ' )[ 2 ].split( '.' ), flash = parseFloat( t0[ 0 ] + '.' + t0[ 1 ] );
		else if( agent.indexOf( 'webtv' ) > -1 ) flash = agent.indexOf( 'webtv/2.6' ) > -1 ? 4 : agent.indexOf( 'webtv/2.5' ) > -1 ? 3 : 2;
	} )();
	// dom
	switch( browser ) {
		case 'ie':
			if( bv == -1 ) bv = !c[ 'getContext' ] ? 8 : !( 'msTransition' in s ) && !( 'transition' in s ) ? 9 : c.getContext( 'webgl' ) || c.getContext( 'experimental-webgl' ) ? 11 : 10;
			prefixCss = '-ms-', prefixStyle = 'ms', transform3D = bv > 9 ? true : false, docMode = doc[ 'documentMode' ] || 0;
			break;
		case 'firefox':
			prefixCss = '-moz-', prefixStyle = 'Moz', transform3D = true;
			break;
		case 'opera':
			prefixCss = '-o-', prefixStyle = 'O', transform3D = true;
			break;
		default:
			prefixCss = '-webkit-', prefixStyle = 'webkit', transform3D = os == 'android' ? ( osv < 4 ? false : true ) : true;
	}
	if( keyframe ) {
		if( keyframe.WEBKIT_KEYFRAME_RULE ) keyframe = '-webkit-keyframes';
		else if( keyframe.MOZ_KEYFRAME_RULE ) keyframe = '-moz-keyframes';
		else if( keyframe.KEYFRAME_RULE ) keyframe = 'keyframes';
		else keyframe = null;
	}

	return {
		device: device,
		os: os,
		osVer: osv,
		browser: browser,
		browserVer: bv,
		ie8: browser == 'ie' && bv < 9 ? true : false,
		mobile: device == 'pc' ? false : true,
		flash: flash,
		prefixCss: prefixCss,
		prefixStyle: prefixStyle,
		transform3D: transform3D,
		transform: ( prefixStyle + 'Transform' in s || 'transform' in s ) ? true : false,
		transition: ( prefixStyle + 'Transition' in s || 'transition' in s ) ? true : false,
		keyframe: keyframe,
		float: 'cssFloat' in s ? 'cssFloat' : 'styleFloat',
		canvas: c ? true : false,
		canvasText: c && c[ 'getContext' ] && c.getContext( '2d' ).fillText ? true : false,
		audio: a ? true : false,
		video: v ? true : false,
		videoPoster: v && 'poster' in v ? true : false,
		videoWebm: v && v[ 'canPlayType' ] && v.canPlayType( 'video/webm; codecs="vp8,mp4a.40.2"' ).indexOf( 'no' ) == -1 ? true : false,
		videoH264: v && v[ 'canPlayType' ] && v.canPlayType( 'video/mp4; codecs="avc1.4D401E, mp4a.40.2"' ).indexOf( 'no' ) == -1 ? true : false,
		videoTeora: v && v[ 'canPlayType' ] && v.canPlayType( 'video/ogg; codecs="theora,vorbis"' ).indexOf( 'no' ) == -1 ? true : false,
		insertBefore: 'insertBefore' in d ? true : false,
		innerText: 'innerText' in d ? true : false,
		textContent: 'textContent' in d ? true : false,
		touchBool: 'ontouchstart' in w ? true : false,
		currentTarget: browser == 'firefox' ? 'target' : 'srcElement',
		wheelEvent: browser == 'firefox' ? 'DOMMouseScroll' : 'mousewheel',
		isLocalhost: location.host.indexOf( 'localhost' ) < 0 ? false : true
	}
} )( dk.W, dk.DOC ) );
