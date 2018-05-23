var gulp = require( 'gulp' );
var concat = require( 'gulp-concat' );
var sourcemaps = require( 'gulp-sourcemaps' );

var src = 'public/src/';
var dist = 'public/dist/';

gulp.task( "combine", function() {
	return gulp.src( [
			src + 'bloodstone.js',
			src + 'detector.js',
			src + 'util.js',
			src + 'listManager.js',
			src + 'scroll.js'
		] )
		.pipe( sourcemaps.init() )
		.pipe( concat( 'bloodstone.js' ) )
		.pipe( sourcemaps.write( './maps' ) )
		.pipe( gulp.dest( dist ) );
} );

gulp.task( 'default', [
	'combine'
] );
