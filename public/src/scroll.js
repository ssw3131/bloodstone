// Scroll :
dk.makeClass( 'Scroll', ( function() {
	var init, destroy, changeTarget, goTop;
	var $sel;
	var _isInitialized;
	var _getMaxDoc, _getMaxDom, _getMax, _addEvent, _delEvent;
	var _scrollY, _max, _timer, _isMove = false;

	/**
	 * @class	: Scroll
	 * @param	: target - 타겟, 기본값 $( window )
	 * @param	: time - 모션 시간, 기본값 1
	 * @param	: ease - 모션 이징값, 기본값 Power4.easeOut
	 * @param	: initGap - 이동 값, 기본값 200
	 */
	init = function( target, time, ease, initGap ) {
		if( _isInitialized ) return;
		_isInitialized = true;

		$sel = {
			win: $( window ),
			doc: $( document ),
			target: target == undefined ? $( window ) : target
		};

		_getMax = $sel.target.prop( 'scrollHeight' ) == undefined ? _getMaxDoc : _getMaxDom;

		_addEvent( time == undefined ? 1 : time, ease == undefined ? Power4.easeOut : ease, initGap == undefined ? 200 : initGap );
	};

	destroy = function() {
		_delEvent();
		_isMove = false;
		$sel = null;
		_isInitialized = false;
	};

	changeTarget = function( target ) {
		TweenLite.killTweensOf( $sel.target, { scrollTo: true } );
		_isMove = false;
		$sel.target = target;
		_getMax = $sel.target.prop( 'scrollHeight' ) == undefined ? _getMaxDoc : _getMaxDom;
	};

	goTop = function() {
		TweenLite.killTweensOf( $sel.win, { scrollTo: true } );
		TweenLite.to( $sel.win, 1, { scrollTo: 0, ease: Power4.easeOut, onComplete: function() { _isMove = false; } } );
	};

	_getMaxDoc = function() {
		_max = $sel.doc.height() - $sel.win.height();
	};

	_getMaxDom = function() {
		_max = $sel.target.prop( 'scrollHeight' ) - $sel.win.height();
	};

	_addEvent = function( time, ease, initGap ) {
		$sel.win.on( 'mousewheel.Scroll DOMMouseScroll.Scroll', function( e ) {
			e.preventDefault();
			var ev = window.event || e.originalEvent;
			var delta = ev.detail ? ev.detail < 0 ? -1 : 1 : ev.wheelDelta > 0 ? -1 : 1;
			var gap = delta > 0 ? initGap : -initGap;

			_getMax();
			if( !_isMove ) {
				_isMove = true;
				_scrollY = $sel.target.scrollTop();
			}
			_isMove = true;
			_scrollY = _scrollY + gap;
			_scrollY = _scrollY < 0 ? 0 : _scrollY >= _max ? _max : _scrollY;
			TweenLite.killTweensOf( $sel.target, { scrollTo: true } );
			TweenLite.to( $sel.target, time, { scrollTo: _scrollY, ease: ease } );
			clearTimeout( _timer );
			_timer = setTimeout( function() { _isMove = false; }, time * 1000 );
		} );
	};

	_delEvent = function() {
		TweenLite.killTweensOf( $sel.target, { scrollTo: true } );
		$sel.win.off( '.Scroll' );
	};

	return {
		init: init,
		destroy: destroy,
		changeTarget: changeTarget,
		goTop: goTop
	}
} )() );

// ScrollCheck :
dk.makeClass( 'ScrollCheck', ( function() {
	var add, destroy, reset;
	var _init, _addEvent, _delEvent, _check;
	var $sel;
	var _list = [],
		_winHeight;

	add = function( $dom, cb ) {
		if( $dom.length == 0 ) return;

		_list.push( {
			$dom: $dom,
			cb: cb,
			offsetTop: $dom.offset().top
		} );
		if( _list.length == 1 ) _init();

		_check();
	};

	destroy = function() {
		_delEvent();
		$sel = null;
		_list = [];
	};

	reset = function() {
		if( _list.length == 0 ) return;

		// offsetTop 재계산
		var i = _list.length;
		var obj;
		while( i-- ) {
			obj = _list[ i ];
			obj.offsetTop = obj.$dom.offset().top;
		}
		// window height 재계산
		_winHeight = $sel.win.height();
	};

	_init = function() {
		$sel = {
			win: $( window )
		};
		_addEvent();
	};

	_addEvent = function() {
		var resize;
		resize = function() {
			_winHeight = $sel.win.height();
		};
		$sel.win.on( 'resize.ScrollCheck', resize );
		resize();

		$sel.win.on( 'scroll.ScrollCheck', function() {
			_check();
		} );
	};

	_delEvent = function() {
		$sel.win.off( '.ScrollCheck' );
	};

	_check = function() {
		var i = _list.length;
		var obj;
		var scrollTop = $sel.win.scrollTop();
		while( i-- ) {
			obj = _list[ i ];
			obj.cb( obj.offsetTop - scrollTop, _winHeight, obj.$dom );
		}
	};

	return {
		add: add,
		destroy: destroy,
		reset: reset
	}
} )() );
