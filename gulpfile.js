var gulp = require( 'gulp' );
var concat = require( 'gulp-concat' );
var sourcemaps = require( 'gulp-sourcemaps' );
var uglify = require( 'gulp-uglify' );

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
		.pipe( concat( 'bloodstone.js' ) )
		.pipe( gulp.dest( dist ) );
} );
gulp.task( "combine2", function() {
	return gulp.src( [
			src + 'bloodstone.js',
			src + 'detector.js',
			src + 'util.js',
			src + 'listManager.js',
			src + 'scroll.js'
		] )
		.pipe( sourcemaps.init() )
		.pipe( concat( 'bloodstone.min.js' ) )
		.pipe( uglify() )
		.pipe( sourcemaps.write( './maps' ) )
		.pipe( gulp.dest( dist ) );
} );

// watch 변화감지
gulp.task( 'watch', _ => {
	gulp.watch( src + '*.js', [ 'combine', 'combine2' ] );
} );

gulp.task( 'default', [
	'combine',
	'combine2',
	'watch'
] );
