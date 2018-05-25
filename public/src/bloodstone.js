'use strict';
( function() {
	var W = window,
		DOC = document;
	var dk;
	var trim = /^\s*|\s*$/g;

	// 보정패치 :
	W.console = W[ 'console' ] ? W[ 'console' ] : { log: function() {} },
		W.log = W[ 'log' ] ? W[ 'log' ] : function() { if( !dk.IS_DEBUG ) return; W.console.info( arguments[ 0 ] ); if( arguments[ 0 ] == 'debug') debugger; },
		Date.now = Date.now * 1 || function() { return +new Date },
		W.requestAnimationFrame = ( function() { return W.requestAnimationFrame || W.webkitRequestAnimationFrame || W.mozRequestAnimationFrame || function( loop ) { W.setTimeout( loop, 17 ) } } )(),
		W.cancelAnimationFrame = ( function() { return W.cancelAnimationFrame || W.webkitCancelRequestAnimationFrame || W.webkitCancelAnimationFrame || W.mozCancelAnimationFrame || function( requestID ) { W.clearTimeout( requestID ) } } )(),
		( function( f ) { W.setTimeout = f( W.setTimeout ), W.setInterval = f( W.setInterval ) } )( function( f ) {
			return function( a, b ) {
				var arg = [].slice.call( arguments, 2 );
				return f( function() { a.apply( this, arg ); }, b );
			};
		} ),

		// dk :
		dk = W.dk = W[ 'dk' ] ? W[ 'dk' ] : {},

		// CORE const :
		dk.makeFunction = function( k, v ) {
			k = k.replace( trim, '' ), k = k.charAt( 0 ).toLowerCase() + k.substring( 1, k.length ),
				dk[ k ] !== undefined ? dk.err( 'dk function에 이미 ' + k + '값이 존재합니다' ) : dk[ k ] = v;
		},
		dk.makeClass = function( k, v ) {
			k = k.replace( trim, '' ), k = k.charAt( 0 ).toUpperCase() + k.substring( 1, k.length ),
				dk[ k ] !== undefined ? dk.err( 'dk class에 이미 ' + k + '값이 존재합니다' ) : dk[ k ] = v;
		},
		dk.makeStatic = function( k, v ) {
			k = k.replace( trim, '' ).toUpperCase(),
				dk[ k ] !== undefined ? dk.err( 'dk static에 이미 ' + k + '값이 존재합니다' ) : dk[ k ] = v;
		},

		// INFO :
		dk.makeStatic( 'INFO', { name: 'dk bloodstone', version: 'v0.0.1', github: 'https://github.com/ssw3131/bloodstone' } ),

		// ERROR :
		dk.makeFunction( 'err', function( v ) {
			throw 'dk error : ' + v;
			// log( 'dk error : ' + v );
		} ),

		// IS_DEBUG :
		dk.makeFunction( 'isDebug', function( v ) {
			dk.IS_DEBUG = v;
		} ),

		// BOM :
		dk.makeStatic( 'W', W ),
		dk.makeStatic( 'DOC', DOC ),
		dk.makeStatic( 'HEAD', DOC.getElementsByTagName( 'head' )[ 0 ] );
} )();
