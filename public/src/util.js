// UTIL :
dk.fn( 'random', ( function( $mathRandom ) {
		return function( $max, $min ) {
			return $max = $max || 1, $min = $min || 0, ( $max - $min ) * $mathRandom() + $min;
		}
	} )( Math.random ) ),

	dk.fn( 'randomInt', ( function( $mathRandom ) {
		return function( $max, $min ) {
			return $min = $min || 0, parseInt( ( $max - $min + 0.99999 ) * $mathRandom() + $min );
		}
	} )( Math.random ) ),

	dk.fn( 'randomColor', ( function( $randomInt ) {
		return function() {
			return 'rgb(' + $randomInt( 256 ) + ', ' + $randomInt( 256 ) + ', ' + $randomInt( 256 ) + ')';
		}
	} )( dk.randomInt ) ),

	dk.fn( 'timeCheck', ( function( $dateNow ) {
		var t0, r;
		return function() {
			return t0 ? ( r = $dateNow() - t0, t0 = null, r ) : ( t0 = $dateNow(), null );
		}
	} )( Date.now ) );
