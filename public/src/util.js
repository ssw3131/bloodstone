// UTIL :
dk.function( 'random', ( function( mathRandom ) {
		return function( max, min ) {
			return max = max || 1, min = min || 0, ( max - min ) * mathRandom() + min;
		}
	} )( Math.random ) ),

	dk.function( 'randomInt', ( function( $mathRandom ) {
		return function( max, min ) {
			return min = min || 0, parseInt( ( max - min + 0.99999 ) * $mathRandom() + min );
		}
	} )( Math.random ) ),

	dk.function( 'randomColor', ( function( randomInt ) {
		return function() {
			return 'rgb(' + randomInt( 256 ) + ', ' + randomInt( 256 ) + ', ' + randomInt( 256 ) + ')';
		}
	} )( dk.randomInt ) ),

	dk.function( 'timeCheck', ( function( dateNow ) {
		var t0, r;
		return function() {
			return t0 ? ( r = dateNow() - t0, t0 = null, r ) : ( t0 = dateNow(), null );
		}
	} )( Date.now ) ),

	dk.function( 'parseLocation', ( function() {
		var obj;
		return function() {
			if( obj === undefined ) {
				var pairs = location.search.substring( 1 ).split( "&" );
				var pair, i;

				obj = {};
				for( i in pairs ) {
					if( pairs[ i ] === "" ) continue;
					pair = pairs[ i ].split( "=" );
					obj[ decodeURIComponent( pair[ 0 ] ) ] = decodeURIComponent( pair[ 1 ] );
				}

				return obj;
			} else {
				return obj;
			}
		}
	} )() );
	log( 'test' );
