// BtModule :
dk.cls( 'BtModule', ( function() {
	var factory, BtModule;
	var initBts, addTimer, delTimer;

	// obj.$bts, obj.act, obj.btAct, obj.autoPlay, obj.autoPlaySpeed, obj.initIdx
	BtModule = function( obj ) {
		if( obj.$bts === undefined ) dk.err( 'BtModule : $bts' + '는 필수항목 입니다' ); // 외부 btAct 함수
		if( obj.act === undefined ) dk.err( 'BtModule : act' + '는 필수항목 입니다' );
		this.$bts = obj.$bts; // 돔 a 태그 리스트
		this.autoPlay = obj.autoPlay; // auto play 여부
		this.autoPlaySpeed = obj.autoPlaySpeed || 3000; // auto play speed
		this.leng = this.$bts.parent().length; // a 태그 갯수
		this.idx; // 현재 활성화 idx
		this.oldIdx; // 기존 idx
		this.timer; // timer

		this.btAct = ( function() {
			if( obj.btAct === undefined ) {
				// 내부 btAct 함수
				var $btsLi = obj.$bts.parent();
				return function( idx ) {
					$btsLi.removeClass( 'active' );
					$btsLi.eq( idx ).addClass( 'active' );
				};
			} else {
				// 외부 btAct 함수
				return obj.btAct;
			}
		} )();

		this.act = function( idx ) {
			this.oldIdx = this.idx;
			this.idx = idx;
			this.btAct( this.idx );
			// 외부 act 함수 실행
			obj.act( this.idx, this.oldIdx );
		};

		initBts.call( this );
		addTimer.call( this );

		// 초기 실행 idx
		this.act( obj.initIdx || 0 );
	};

		BtModule.prototype.next = function() {
			var idx = this.idx;
			idx = ++idx == this.leng ? 0 : idx;
			addTimer.call( this );
			this.act( idx );
		};

		BtModule.prototype.prev = function() {
			var idx = this.idx;
			idx = --idx < 0 ? this.leng - 1 : idx;
			addTimer.call( this );
			this.act( idx );
		};

		BtModule.prototype.play = function() {
			this.autoPlay = true;
			addTimer.call( this );
		};

		BtModule.prototype.stop = function() {
			delTimer.call( this );
		};

		initBts = function() {
			var self = this,
				btsTimer;
			this.$bts.on( 'mouseenter', function() {
				delTimer.call( self );
				clearTimeout( btsTimer );
				self.btAct( $( this ).parent().index() );
			} );
			this.$bts.on( 'mouseleave', function() {
				addTimer.call( self );
				btsTimer = setTimeout( function() {
					self.btAct( self.idx );
				}, 300 );
			} );
			this.$bts.on( 'click', function( e ) {
				e.preventDefault();
				var idx = $( this ).parent().index();
				if( self.idx === idx ) return;
				self.act( idx );
			} );
		};

		addTimer = function() {
			if( !this.autoPlay ) return;
			var self = this;
			clearInterval( this.timer );
			this.timer = setInterval( function() {
				self.next();
			}, this.autoPlaySpeed );
		};

		delTimer = function() {
			clearInterval( this.timer );
		};

		factory = function( obj ) {
			return new BtModule( obj );
		};

		return factory;
} )() );
