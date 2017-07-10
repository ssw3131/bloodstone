'use strict';
(function(){
	var W = window, DOC = document;
	var dk;
	var trim = /^\s*|\s*$/g;

// 보정패치 :
	W.console = W[ 'console' ] ? W[ 'console' ] : { log : function(){} },
		W.log = W[ 'log' ] ? W[ 'log' ] : function(){ W.console.log( arguments[ 0 ] ) },
		Date.now = Date.now * 1 || function(){ return +new Date },
		W.requestAnimFrame = (function(){ return W.requestAnimationFrame || W.webkitRequestAnimationFrame || W.mozRequestAnimationFrame || function( loop ){ W.setTimeout( loop, 17 ) } })(),
		(function( f ){ W.setTimeout = f( W.setTimeout ), W.setInterval = f( W.setInterval ) })( function( f ){
			return function( a, b ){
				var arg = [].slice.call( arguments, 2 );
				return f( function(){ a.apply( this, arg ); }, b );
			};
		} ),

// dk :
		dk = W.dk = W[ 'dk' ] ? W[ 'dk' ] : {},

// CORE :
		dk.function = function( k, v ){
			k = k.replace( trim, '' ), k = k.charAt( 0 ).toLowerCase() + k.substring( 1, k.length ),
				dk[ k ] ? dk.err( 'dk.function에 이미 ' + k + '값이 존재합니다' ) : dk[ k ] = v;
		},
		dk.class = function( k, v ){
			k = k.replace( trim, '' ), k = k.charAt( 0 ).toUpperCase() + k.substring( 1, k.length ),
				dk[ k ] ? dk.err( 'dk.class에 이미 ' + k + '값이 존재합니다' ) : dk[ k ] = v;
		},
		dk.static = function( k, v ){
			k = k.replace( trim, '' ).toUpperCase(),
				dk[ k ] ? dk.err( 'dk.static에 이미 ' + k + '값이 존재합니다' ) : dk[ k ] = v;
		},

// INFO :
		dk.static( 'INFO', { name : 'Dk bloodstone', version : 'v0.0.1', github : 'https://github.com/ssw3131/bloodstone.git' } ),

// ERROR :
		dk.function( 'err', function( v ){
			log( 'dk error : ' + v );
		} ),

// BOM :
		dk.static( 'W', W ),
		dk.static( 'DOC', DOC ),
		dk.static( 'HEAD', DOC.getElementsByTagName( 'head' )[ 0 ] );
})();
