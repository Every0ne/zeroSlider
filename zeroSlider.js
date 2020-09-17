'use strict';

/**
 * @brief ZeroSlider object constructor
 *
 * @param container - the Stage DOM element housing all Slides and UI Controls.
 * @param options - object with optional params.
 *
 * @return Optionally returns itself when called without "new" keyword.
 */
var ZeroSlider = function( container, options )
{
	if( !container )
		return;

	if( !( this instanceof ZeroSlider ) )
		return new ZeroSlider( container, options );

	// Build options
	this.options = Object.assign({
		slideDuration: 2000,
		slideNode: 'div.slide',
		nextButton: '.next',
		prevButton: '.prev',
		activeClass: 'on',
		toggleClass: 'toggled',
		autorun: true,
		pauseOnFocus: true,
	}, options );

	// self-reference for use in callbacks
	this.me = this;

	// container with slides
	this.container = typeof container === 'string' ? document.querySelector( container ) : container;

	// fetch slides
	this.slides = this.container.querySelectorAll( this.options.slideNode );
	
	// next/prev buttons
	this.nextButton = this.container.querySelector( this.options.nextButton );
	this.prevButton = this.container.querySelector( this.options.prevButton );

	// setTimeout/setInterval handle
	this.loop = false;

	// Flags
	this.isRunning = true;
	this.isFocused = false;

	// current index for prev/current/next slide determination
	this.currentIndex = 0;

	this.init();
};


/**
 * @brief Slider initiation function.
 *
 * @details Performs some sanity checks, adds event listeners.
 */
ZeroSlider.prototype.init = function()
{
	// Remove nav controls when not enough slides.
	if( this.slides.length < 2 )
	{
		this.removeNavigation();

		// If there's at least one slide, activate it and quit.
		if( this.slides.length == 1 )
			this.slides[0].classList.add( this.options.activeClass );

		return;
	}

	var self = this.me;
	
	// UI interaction events.
	if( this.nextButton ){
		this.nextButton.addEventListener( 'click', function( e ){
			e.preventDefault();
			self.next( true );
		});
	}
	if( this.prevButton ){
		this.prevButton.addEventListener( 'click', function( e ){
			e.preventDefault();
			self.prev( true );
		});
	}

	// Mouse is hovering over stage.
	this.container.addEventListener( 'mouseover', function(){
		self.isFocused = true;
	});

	// Mouse is leaving the stage.
	this.container.addEventListener( 'mouseleave', function(){
		self.isFocused = false;

		if( !self.isRunning )
			self.run();
	});

	// Force a reflow...
	this.reflow();

	// then run the loop if autorun is enabled,
	if( this.options.autorun )
	{
		this.currentIndex--;
		this.run();
	}
	// or just activate the first slide.
	else
		this.slides[0].classList.add( this.options.activeClass );
};


/**
 * @brief Gets transition duration of a slide
 *
 * @param slide element.
 *
 * @return a number of miliseconds
 *
 * @details Gets a string of durations of all transitioning properties,
 * parses it to an array of numbers and returns the number of miliseconds of the longest one.
 * Used to determine how long will the transition take so when to run the idle ( slide duration ) loop part,
 */
ZeroSlider.prototype.getTransitionDuration = function( elt )
{
	function getPropDurations( elt, prop ){
		return getComputedStyle( elt )[ prop ].toLowerCase().split( ',' ).map( function( duration ){
			return ( duration.indexOf( "ms" ) > -1 ) ? parseFloat( duration ) : parseFloat( duration ) * 1000;
		});
	}

	function sumArrays( arr1, arr2 ){
		return arr1.map( function( num, i ){
			var result = num + arr2[i];
			return isNaN( result ) ? 0 : result;
		});
	}

	var transDurations = getPropDurations( elt, 'transition-duration' );
	var transDelays = getPropDurations( elt, 'transition-delay' );

	return Math.max.apply( null, sumArrays( transDurations, transDelays ) );
};


/**
 * @brief Runs the idle part of the loop.
 *
 * @details After the slide idle duration runs the slide cycle loop.
 */
ZeroSlider.prototype.idle = function(){
	this.loop = setTimeout( this.run.bind( this ), this.options.slideDuration );
};


/**
 * @brief Runs the slide cycle loop.
 *
 * @details Checks if all conditions for running the loop are met.
 * If so, sets the run flag and switches slides to next one.
 * If slider autorun is disabled or stage has focus, disables the run flag and stops.
 */
ZeroSlider.prototype.run = function()
{
	if( !this.options.autorun || ( this.options.pauseOnFocus && this.isFocused ) )
	{
		this.isRunning = false;
		return;
	}

	this.isRunning = true;
	this.next();
};


/**
 * @brief Stops the slide cycle loop.
 *
 * @details Note that loop will restart if next/prev is executed,
 * unless this.options.autorun is set to false.
 */
ZeroSlider.prototype.stop = function()
{
	clearTimeout( this.loop );
	this.isRunning = false;
}


/**
 * @brief Gets a slide relative to current index.
 *
 * @param relativeOrder - takes a number as relativity factor where 0 means current,
 * 1 means one forward ( next ),
 * 2 means two forward,
 * -1 means one backward ( previous ), and so on.
 *
 * @return a slide pointed by relativeOrder
 */
ZeroSlider.prototype.getSlide = function( relativeOrder )
{
	var	n = this.currentIndex + relativeOrder,
		l = this.slides.length;

	/* JavaScript implementation of Modulo throws negative numbers
	 * from negative dividends. In this case this needs to be fixed.
	 * Algorhythm taken from http://javascript.about.com/od/problemsolving/a/modulobug.htm
	 */
	return this.slides[ ( ( n % l ) + l ) % l ];
};


/**
 * @brief Shifts current slide with next/previous slide.
 *
 * @param isToggled - boolean. If true, means that slide switch was made by user.
 *
 * @details Fetches current and next/previous slide and feeds it to the animation function
 * along with isToggled param, then increases/decreases the index.
 */
ZeroSlider.prototype.next = function( isToggled )
{
	this.animate( this.getSlide( 0 ), this.getSlide( 1 ), isToggled );
	this.currentIndex++;
};

ZeroSlider.prototype.prev = function( isToggled )
{
	this.animate( this.getSlide( 0 ), this.getSlide( -1 ), isToggled );
	this.currentIndex--;
};

/**
 * @brief Shifts current slide with a supplied slide.
 *
 * @param isToggled - boolean, defaults to true, as this method is only called by user.
 *
 * @details Fetches current and new slide and feeds it to the animation function
 * along with isToggled param, then calculates the index.
 */
ZeroSlider.prototype.other = function( otherSlide, isToggled = true )
{
	var currentSlide = this.slides[0].parentElement.querySelector( '.'+this.options.activeClass );
	this.animate( currentSlide, otherSlide, isToggled );
	this.currentIndex = Array.prototype.indexOf.call( this.slides, otherSlide );
};

/**
 * @brief Turns slides on and off.
 *
 * @param current - currently active slide element to deactivate,
 * @param next - next slide element to activate,
 * @param isToggled - boolean indicating if slide switch was ordered by user.
 */
ZeroSlider.prototype.animate = function( current, next, isToggled )
{
	var
		on     = this.options.activeClass,
		toggle = this.options.toggleClass;

	if( isToggled )
	{
		// Slide switch was user-initiated. Since there could be a timeout running, it needs to be stopped.
		clearTimeout( this.loop );

		for( var i = this.slides.length; i-- ; )
			this.slides[i].classList.add( toggle );

		next.classList.add( on );
		current.classList.remove( on );
	}
	else
	{
		next.classList.remove( toggle );
		next.classList.add( on );
		current.classList.remove( on, toggle );
	}

	var slideSwitch = new CustomEvent('slideswitch', {
		detail: {
			oldSlide:	current,
			newSlide:	next
		}
	});

	this.container.dispatchEvent( slideSwitch );

	// Run flag needs to be set, so that unfocus event doesn't re-run the loop.
	this.isRunning = true;
	this.loop = setTimeout( this.idle.bind( this ), this.getTransitionDuration( next ) );
};


/**
 * @brief Removes navigation controls. Useful if there's less than 2 slides on stage.
 */
ZeroSlider.prototype.removeNavigation = function()
{
	Array.prototype.forEach.call( this.container.querySelectorAll( this.options.prevButton + ', ' + this.options.nextButton ), function( elt ){
		elt.parentNode.removeChild( elt );
	});
};


/**
 * @brief Forces browser to do a repaint.
 * @return the offsetHeight of container.
 * @details Hack is necessary in Firefox to force proper transition of first slide.
 */
ZeroSlider.prototype.reflow = function(){
	return this.container.offsetHeight;
};




// jQuery-compatible libraries adapter
( function( $ ){
	if( $ !== undefined ){
		$.fn.zeroSlider = function( options ){

			return this.toArray().forEach( function( elt ){
				ZeroSlider( elt, options );
			});
		}
	}
})( this.$ || this.cash || this.jQuery || this.Zepto || this.jBone );
