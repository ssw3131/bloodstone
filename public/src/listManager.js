// ListManager :
dk.makeClass( 'ListManager', ( function() {
	var factory, ListManager, fn;
	var _addTimer, _delTimer;

	/**
	 * @class	: ListManager
	 * @param	: leng - list length
	 * @param	: act - 활성화 함수
	 * @param	: option - initId, infinity, autoPlay, autoPlaySpeed
	 */
	ListManager = function( leng, act, option ) {
		if( leng == undefined || leng == 0 ) return dk.err( 'ListManager : leng 이 없거나 0 이면 안됩니다' );
		if( act == undefined ) return dk.err( 'ListManager : act 는 필수항목 입니다' );
		this._leng = leng;
		this._act = act;

		this._option = {
			initId: 0,
			infinity: true,
			autoPlay: false,
			autoPlaySpeed: 4
		};
		$.extend( this._option, option );

		this._id = -1;
		this._oldId = -1;
		this._timer = null;

		this.act( this._option.initId, 'next' );

		if( this._option.autoPlay ) this.play();
	};

	fn = ListManager.prototype;

	fn.destroy = function() {
		this.stop();

		this._timer = null;
		this._oldId = null;
		this._id = null;

		this._option = null;

		this._act = null;
		this._leng = null;
	};

	fn.getId = function() {
		return {
			id: this._id,
			oldId: this._oldId
		}
	};

	fn.act = function( id, directon ) {
		if( id == this._id ) return;
		if( id >= this._leng ) return dk.err( 'ListManager : id값이 leng를 초과하였습니다' );
		this.resetTimer();
		if( !directon ) {
			directon = id > this._id ? 'next' : 'prev';
		}
		this._oldId = this._id;
		this._id = id;
		// log( 'ListManager act : ' + this._id + ', ' + this._oldId + ', ' + directon );
		this._act( this._id, this._oldId, directon );
	};

	fn.next = function() {
		var id = this._id;
		if( !this._option.infinity && id == this._leng - 1 ) return;
		id = ++id == this._leng ? 0 : id;
		this.act( id, 'next' );
	};

	fn.prev = function() {
		var id = this._id;
		if( !this._option.infinity && id == 0 ) return;
		id = --id < 0 ? this._leng - 1 : id;
		this.act( id, 'prev' );
	};

	fn.play = function() {
		this._option.autoPlay = true;
		_addTimer.call( this );
	};

	fn.stop = function() {
		this._option.autoPlay = false;
		_delTimer.call( this );
	};

	fn.pause = function() {
		_delTimer.call( this );
	};

	fn.resetTimer = function() {
		_delTimer.call( this );
		_addTimer.call( this );
	};

	// innner
	_addTimer = function() {
		if( !this._option.autoPlay ) return;
		var self = this;
		var loop, old;

		cancelAnimationFrame( this._timer );

		old = Date.now();
		loop = function() {
			if( Date.now() - old > self._option.autoPlaySpeed * 1000 ) {
				old = Date.now();
				self.next();
			} else {
				self._timer = requestAnimationFrame( loop );
			}
		};
		this._timer = requestAnimationFrame( loop );
	};

	_delTimer = function() {
		cancelAnimationFrame( this._timer );
	};

	factory = function( leng, act, option ) {
		return new ListManager( leng, act, option );
	};

	return factory;
} )() );

// BtManager :
dk.makeClass( 'BtManager', ( function() {
	var factory, BtManager, fn;
	var _addEvent, _delEvent, _connect0, _connect1;

	/**
	 * @class	: BtManager
	 * @param	: $bts - bts 제이쿼리
	 * @param	: act - 버튼 클릭 시 활성화 함수
	 * @param	: option - btAct, freezeTime, ListManager 동일 (initId, infinity, autoPlay, autoPlaySpeed)
	 */
	BtManager = function( $bts, act, option ) {
		if( $bts.length == 0 ) return dk.err( 'BtManager : $bts 는 필수항목 입니다' );
		if( act === undefined ) return dk.err( 'BtManager : act 는 필수항목 입니다' );
		this._$bts = $bts;

		var _act = ( function( self ) {
			return function( id, oldId, directon ) {
				if( self._isMove ) return;
				self._isMove = true;
				if( self._option.freezeTime == 0 ) self._isMove = false;
				else setTimeout( function() { self._isMove = false; }, self._option.freezeTime * 1000 );
				self._btAct( id, oldId, directon );
				act.call( self, id, oldId, directon );
			};
		} )( this );

		this._option = {
			btAct: undefined,
			freezeTime: 0,
			autoPlaySpeed: 4
		};
		$.extend( this._option, option );
		if( this._option.freezeTime >= this._option.autoPlaySpeed ) return dk.err( 'BtManager : freezeTime 은 autoPlaySpeed 보다 작아야 합니다' );

		this._btAct = ( function( self ) {
			if( self._option.btAct === undefined ) {
				return function( id, oldId, directon ) {
					$bts.removeClass( 'on' );
					$bts.eq( id ).addClass( 'on' );
				};
			} else {
				return function( id, oldId, directon ) {
					self._option.btAct.call( self, id, oldId, directon );
				};
			}
		} )( this );

		this._isMove = false;

		this._ListManager = dk.ListManager( $bts.length, _act, this._option );

		_addEvent.call( this );
	};
	fn = BtManager.prototype;

	_connect0 = function(){
		var i = arguments.length;
		var name;
		while ( i-- ) {
			name = arguments[ i ];
			fn[ name ] = (function( name ){
				return function(){
					return this._ListManager[ name ].apply( this._ListManager, arguments );
				};
			})( name );
		}
	};

	_connect1 = function(){
		var i = arguments.length;
		var name;
		while ( i-- ) {
			name = arguments[ i ];
			fn[ name ] = (function( name ){
				return function(){
					if( this._isMove ) return;
					return this._ListManager[ name ].apply( this._ListManager, arguments );
				};
			})( name );
		}
	};

	fn.destroy = function() {
		_delEvent.call( this );
		this._ListManager.destroy();
		this._ListManager = null;
		this._isMove = null;
		this._btAct = null;
		this._option = null;
		this._$bts = null;
	};

	_connect0( 'getId', 'play', 'stop', 'pause', 'resetTimer' );

	_connect1( 'act', 'next', 'prev' );

	_addEvent = function() {
		var self = this,
			$a = this._$bts.find( '>a' ),
			timer;
		$a.on( 'mouseenter', function() {
			self.pause();
			clearTimeout( timer );
			var id = $( this ).parent().index();
			self._btAct( id );
		} );
		$a.on( 'mouseleave', function() {
			self.resetTimer();
			timer = setTimeout( function() {
				var id = self.getId().id;
				self._btAct( id );
			}, 300 );
		} );
		$a.on( 'click', function( e ) {
			e.preventDefault();
			if( self._isMove ) return;
			var id = $( this ).parent().index();
			self.act( id );
		} );
	};

	_delEvent = function() {
		var $a = this._$bts.find( '>a' );
		$a.off();
	};

	factory = function( $bts, act, option ) {
		return new BtManager( $bts, act, option );
	};
	return factory;
} )() );

// Tab :
dk.makeClass( 'Tab', ( function() {
	var factory, Tab, fn;
	var _connect0;

	/**
	 * @class	: Tab
	 * @param	: $tab - tab 제이쿼리
	 * @param	: $tabCon - tab content 제이쿼리
	 * @param	: option - motionTime, BtManager 동일 (act, btAct, freezeTime, initId, infinity, autoPlay, autoPlaySpeed)
	 */
	Tab = function( $tab, $tabCon, option ) {
		if( $tab.length == 0 ) return dk.err( 'Tab : $tab 는 필수항목 입니다' );
		if( $tabCon.length == 0 ) return dk.err( 'Tab : $tabCon 는 필수항목 입니다' );
		this._$tab = $tab;
		this._$tabCon = $tabCon;

		this._option = {
			motionTime: 0.5
		};
		$.extend( this._option, option );

		var _act = ( function( self ) {
			if( self._option.act === undefined ) {
				TweenLite.set( self._$tabCon, { 'display': 'none', 'opacity': 0 } );
				return function( id, oldId ) {
					var $oldCon = $tabCon.eq( oldId );
					var $actCon = $tabCon.eq( id );
					TweenLite.killTweensOf( $oldCon );
					TweenLite.set( $oldCon, { 'display': 'none', 'opacity': 0 } );
					TweenLite.killTweensOf( $actCon );
					TweenLite.set( $actCon, { 'display': 'block' } );
					TweenLite.to( $actCon, self._option.motionTime, { opacity: 1, ease: Power2.easeOut } );
				}
			} else {
				return function( id, oldId, directon ) {
					self._option.act.call( self, id, oldId, directon );
				};
			}
		} )( this );

		this._BtManager = dk.BtManager( $tab, _act, this._option );
	};
	fn = Tab.prototype;

	_connect0 = function(){
		var i = arguments.length;
		var name;
		while ( i-- ) {
			name = arguments[ i ];
			fn[ name ] = (function( name ){
				return function(){
					return this._BtManager[ name ].apply( this._BtManager, arguments );
				};
			})( name );
		}
	};

	fn.destroy = function() {
		this._BtManager.destroy();
		this._option = null;
		this._$tabCon = null;
		this._$tab = null;
	};

	_connect0( 'getId', 'act', 'next', 'prev', 'play', 'stop', 'pause', 'resetTimer' );

	factory = function( $tab, $tabCon, option ) {
		return new Tab( $tab, $tabCon, option );
	};
	return factory;
} )() );

// Slider :
dk.makeClass( 'Slider', ( function() {
	var factory, Slider, fn;
	var _defaultOption, _addTouchEvent, _delTouchEvent, _connect0, _connect1;
	var Slide, Dot, Arrow;

	/**
	 * @class	: Slider
	 * @param	: $slide - slide 제이쿼리
	 * @param	: option - $dot, $arrow, onAct, touch, motionType, freezeTime, motionTime, motionDelay, motionEaseAct, motionEaseOld, ListManager 동일 (initId, infinity, autoPlay, autoPlaySpeed)
	 */
	Slider = function( $slide, option ) {
		if( $slide.length == 0 ) return dk.err( 'Slider : $slide 는 필수항목 입니다' );
		this._$slideUl = $slide;
		this._$slideLi = $slide.find( '>li' );
		this._leng = this._$slideLi.length;

		this._option = _defaultOption( option.motionType );
		$.extend( this._option, option );
		if( this._option.freezeTime >= this._option.autoPlaySpeed ) return dk.err( 'Slider : freezeTime 은 autoPlaySpeed 보다 작아야 합니다' );

		this._Slide = Slide( this._$slideUl, this._$slideLi, this._leng, this._option.motionType, this._option.motionTime, this._option.motionDelay, this._option.motionEaseAct, this._option.motionEaseOld );
		if( this._option.$dot ) this._Dot = Dot( this, this._option.$dot, this._leng );
		if( this._option.$arrow ) this._Arrow = Arrow( this, this._option.$arrow, this._leng, this._option.infinity );

		var _act = ( function( self ) {
			var isFirst = true;
			return function( id, oldId, directon ) {
				if( self._isMove ) return;
				self._isMove = true;
				if( self._option.freezeTime == 0 || isFirst ) self._isMove = false;
				else setTimeout( function() { self._isMove = false; }, self._option.freezeTime * 1000 );
				isFirst = false;
				// log( 'Slider act : ' + id + ', ' + oldId + ', ' + directon );
				self._Slide.act( id, oldId, directon );
				if( self._option.$dot ) self._Dot.act( id, oldId, directon );
				if( self._option.$arrow ) self._Arrow.act( id, oldId, directon );
				if( self._option.onAct ) self._option.onAct.call( self, id, oldId, directon );
			};
		} )( this );

		this._isMove = false;

		this._ListManager = dk.ListManager( this._leng, _act, this._option );

		if( this._option.touch ) _addTouchEvent.call( this );
	};
	fn = Slider.prototype;

	_defaultOption = function( type ) {
		var basicOption = { $dot: undefined, $arrow: undefined, onAct: undefined, touch: false, infinity: true, autoPlay: true, autoPlaySpeed: 4 };
		var motionOption;
		switch( type ) {
			case 'fixed':
				motionOption = {
					motionType: 'fixed',
					freezeTime: 0.5,
					motionTime: 1,
					motionDelay: 0,
					motionEaseAct: Power2.easeOut,
					motionEaseOld: null
				};
				break;
			case 'slideDelay':
				motionOption = {
					motionType: 'slideDelay',
					freezeTime: 1,
					motionTime: 2,
					motionDelay: 0,
					motionEaseAct: Power4.easeOut,
					motionEaseOld: Power4.easeInOut
				};
				break;
			case 'fade':
				motionOption = {
					motionType: 'fade',
					freezeTime: 0.5,
					motionTime: 1,
					motionDelay: 0,
					motionEaseAct: Power2.easeOut,
					motionEaseOld: Power2.easeOut
				};
				break;
			default:
				motionOption = {
					motionType: 'slide',
					freezeTime: 0.5,
					motionTime: 1,
					motionDelay: 0,
					motionEaseAct: Power4.easeOut,
					motionEaseOld: Power4.easeOut
				};
		}
		return $.extend( basicOption, motionOption );
	};

	_addTouchEvent = function() {
		var self = this;
		var _start = false;
		this._$slideUl.swipe( {
			swipeStatus: function( event, phase, direction, distance, duration, fingers, fingerData, currentDirection ) {
				if( phase == 'end' || phase == 'cancel' ) return _start = false;
				if( _start ) return;
				if( phase == 'move' ) _start = true;
				if( self._isMove ) return;
				switch( direction ) {
					case 'left':
						self.next();
						break;
					case 'right':
						self.prev();
						break;
				}
			}
		} );
	};

	_delTouchEvent = function() {
		this._$slideUl.swipe( 'destroy' );
	};

	_connect0 = function(){
		var i = arguments.length;
		var name;
		while ( i-- ) {
			name = arguments[ i ];
			fn[ name ] = (function( name ){
				return function(){
					return this._ListManager[ name ].apply( this._ListManager, arguments );
				};
			})( name );
		}
	};

	_connect1 = function(){
		var i = arguments.length;
		var name;
		while ( i-- ) {
			name = arguments[ i ];
			fn[ name ] = (function( name ){
				return function(){
					if( this._isMove ) return;
					return this._ListManager[ name ].apply( this._ListManager, arguments );
				};
			})( name );
		}
	};

	fn.destroy = function() {
		if( this._option.touch ) _delTouchEvent.call( this );
		this._ListManager.destroy();
		this._ListManager = null;
		this._isMove = null;
		if( this._Arrow ) {
			this._Arrow.destroy();
			this._Arrow = null;
		}
		if( this._Dot ) {
			this._Dot.destroy();
			this._Dot = null;
		}
		this._Slide.destroy();
		this._Slide = null;
		this._option = null;
		this._leng = null;
		this._$slideLi = null;
		this._$slideUl = null;
	};

	_connect0( 'getId', 'play', 'stop', 'pause', 'resetTimer' );

	_connect1( 'act', 'next', 'prev' );

	factory = function( $slide, option ) {
		return new Slider( $slide, option );
	};

	// Slide
	Slide = ( function() {
		var factory, Slide, fn;
		var _initMotion, _actMotion;

		Slide = function( $slideUl, $slideLi, leng, motionType, motionTime, motionDelay, motionEaseAct, motionEaseOld ) {
			this._$ul = $slideUl;
			this._$li = $slideLi;
			this._leng = leng;
			this._motionOption = {
				type: motionType,
				time: motionTime,
				delay: motionDelay,
				easeAct: motionEaseAct,
				easeOld: motionEaseOld
			};
			this._isFirst = true;
			_initMotion[ motionType ].call( this );
		};
		fn = Slide.prototype;

		fn.destroy = function() {
			this._motionOption = null;
			this._leng = null;
			this._$li = null;
			this._$ul = null;
		};

		fn.act = function( id, oldId, directon ) {
			if( this._isFirst ) return this._isFirst = false;
			_actMotion[ this._motionOption.type ].call( this, id, oldId, directon );
		};

		_initMotion = {
			fixed: function() {
				this._$ul.css( { 'position': 'relative', 'overflow': 'hidden' } );
				TweenLite.set( this._$li, { x: '100%', 'overflow': 'hidden' } );
				TweenLite.set( this._$li.find( '>div' ), { x: '-100%' } );
				TweenLite.set( this._$li.eq( 0 ), { x: '0%', opacity: 1 } );
				TweenLite.set( this._$li.eq( 0 ).find( '>div' ), { x: '0%' } );
			},
			slideDelay: function() {
				this._$ul.css( { 'position': 'relative', 'overflow': 'hidden' } );
				TweenLite.set( this._$li, { x: '100%', opacity: 0 } );
				TweenLite.set( this._$li.eq( 0 ), { x: '0%', opacity: 1 } );
			},
			fade: function() {
				TweenLite.set( this._$li, { opacity: 0 } );
				TweenLite.set( this._$li.eq( 0 ), { opacity: 1 } );
			},
			slide: function() {
				this._$ul.css( { 'position': 'relative', 'overflow': 'hidden' } );
				TweenLite.set( this._$li, { x: '100%' } );
				TweenLite.set( this._$li.eq( 0 ), { x: '0%' } );
			}
		};

		_actMotion = {
			fixed: function( id, oldId, directon ) {
				var $actLi, $oldLi, $actLiDiv;

				this._$li.css( 'z-index', 0 );

				$actLi = this._$li.eq( id );
				$actLiDiv = $actLi.find( '>div' );
				$actLi.css( 'z-index', 2 );
				TweenLite.killTweensOf( $actLi );
				TweenLite.set( $actLi, { x: directon == 'next' ? '100%' : '-100%' } );
				TweenLite.set( $actLiDiv, { x: directon == 'next' ? '-100%' : '100%' } );
				TweenLite.to( $actLi, this._motionOption.time, { x: '0%', ease: this._motionOption.easeAct } );
				TweenLite.to( $actLiDiv, this._motionOption.time, { x: '0%', ease: this._motionOption.easeAct } );

				if( oldId < 0 ) return;
				$oldLi = this._$li.eq( oldId );
				$oldLi.css( 'z-index', 1 );
			},
			slideDelay: function( id, oldId, directon ) {
				var $actLi, $oldLi;

				this._$li.css( 'z-index', 0 );

				$actLi = this._$li.eq( id );
				$actLi.css( 'z-index', 2 );
				TweenLite.killTweensOf( $actLi );
				TweenLite.set( $actLi, { x: directon == 'next' ? '100%' : '-100%', opacity: 1 } );
				TweenLite.to( $actLi, this._motionOption.time, { x: '0%', ease: this._motionOption.easeAct } );

				if( oldId < 0 ) return;
				$oldLi = this._$li.eq( oldId );
				$oldLi.css( 'z-index', 1 );
				TweenLite.to( $oldLi, this._motionOption.time, { delay: this._motionOption.delay, x: directon == 'next' ? '-100%' : '100%', opacity: 0, ease: this._motionOption.easeOld } );
			},
			fade: function( id, oldId, directon ) {
				var $actLi, $oldLi;

				$actLi = this._$li.eq( id );
				TweenLite.killTweensOf( $actLi );
				TweenLite.to( $actLi, this._motionOption.time, { opacity: 1, ease: this._motionOption.easeAct } );

				if( oldId < 0 ) return;
				$oldLi = this._$li.eq( oldId );
				TweenLite.to( $oldLi, this._motionOption.time, { delay: this._motionOption.delay, opacity: 0, ease: this._motionOption.easeOld } );
			},
			slide: function( id, oldId, directon ) {
				var $actLi, $oldLi;

				$actLi = this._$li.eq( id );
				TweenLite.set( $actLi, { x: directon == 'next' ? '100%' : '-100%' } );
				TweenLite.to( $actLi, this._motionOption.time, { x: '0%', ease: this._motionOption.easeAct } );

				if( oldId < 0 ) return;
				$oldLi = this._$li.eq( oldId );
				TweenLite.to( $oldLi, this._motionOption.time, { delay: this._motionOption.delay, x: directon == 'next' ? '-100%' : '100%', ease: this._motionOption.easeOld } );
			}
		};

		factory = function( $slideUl, $slideLi, leng, motionType, motionTime, motionDelay, motionEaseAct, motionEaseOld ) {
			return new Slide( $slideUl, $slideLi, leng, motionType, motionTime, motionDelay, motionEaseAct, motionEaseOld );
		};
		return factory;
	} )();

	// Dot
	Dot = ( function() {
		var factory, Dot, fn;
		var _addEvent, _delEvent;

		Dot = function( caller, $dot, leng ) {
			this._caller = caller;

			this._$ul = $dot;
			this._$clone = this._$ul.find( '>li:first-child' ).removeClass( 'on' ).clone();
			this._$ul.empty();
			for( var i = 0; i < leng; i++ ) {
				this._$ul.append( this._$clone.clone() );
			}
			this._$li = this._$ul.find( '>li' );

			_addEvent.call( this );
		};
		fn = Dot.prototype;

		fn.destroy = function() {
			_delEvent.call( this );
			this._$li = null;
			this._$ul.empty();
			this._$clone = null;
			this._$ul = null;
			this._caller = null;
		};
		fn.act = function( id, oldId, directon ) {
			this._$li.removeClass( 'on' );
			this._$li.eq( id ).addClass( 'on' );
		};

		_addEvent = function() {
			var caller = this._caller;
			this._$li.find( '>a' ).on( 'click', function( e ) {
				e.preventDefault();
				var id = $( this ).parent().index();
				caller.act( id );
			} );
		};

		_delEvent = function() {
			this._$li.find( '>a' ).off();
		};

		factory = function( caller, $dot, leng ) {
			return new Dot( caller, $dot, leng );
		};
		return factory;
	} )();

	// Arrow
	Arrow = ( function() {
		var factory, Arrow, fn;
		var _addEvent, _delEvent;

		Arrow = function( caller, $arrow, leng, infinity ) {
			this._caller = caller;
			this._$arrow = $arrow;
			this._$prev = this._$arrow.find( 'a.prev' );
			this._$next = this._$arrow.find( 'a.next' );
			this._leng = leng;
			this._infinity = infinity;
			_addEvent.call( this );
		};
		fn = Arrow.prototype;

		fn.destroy = function() {
			_delEvent.call( this );
			this._infinity = null;
			this._leng = null;
			this._$next = null;
			this._$prev = null;
			this._$arrow = null;
			this._caller = null;
		};

		fn.act = function( id, oldId, directon ) {
			if( this._infinity ) return;
			id == 0 ? this._$prev.hide() : this._$prev.show();
			id == this._leng - 1 ? this._$next.hide() : this._$next.show();
		};

		_addEvent = function() {
			var caller = this._caller;
			this._$prev.on( 'click', function( e ) {
				e.preventDefault();
				caller.prev();
			} );
			this._$next.on( 'click', function( e ) {
				e.preventDefault();
				caller.next();
			} );
		};

		_delEvent = function() {
			this._$prev.off();
			this._$next.off();
		};

		factory = function( caller, $arrow, leng, infinity ) {
			return new Arrow( caller, $arrow, leng, infinity );
		};
		return factory;
	} )();

	return factory;
} )() );
