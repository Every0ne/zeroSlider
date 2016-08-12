'use strict';

/**
 *  @brief PureSlider object constructor
 *
 *  @param [in] container - the Stage DOM element housing all Slides and UI Controls.
 *  @param [in] options - object with optional params.
 * 
 *  @return Optionally returns itself when called without "new" keyword.
 */
var PureSlider = function(container, options){

	if( !( this instanceof PureSlider ) ){
		return new PureSlider(container, options);
	}

	// self-reference for use in callbacks
	this.me = this;

	// container with slides
	this.container = typeof container === 'string' ? document.querySelector( container ) : container;

	// setTimeout/setInterval handle
	this.loop = false;

	// Flags
	this.isRunning = true;
	this.isFocused = false;

	// current index for prev/current/next slide determination
	this.currentIndex = 0;

	// Default options
	this.defaults = {

		slideDuration: 2000,
		slideNode: 'div.slide',
		nextButton: '.next',
		prevButton: '.prev',
		activeClass: 'on',
		toggleClass: 'toggled',
		autorun: true,
		pauseOnFocus: true,
	};

	// Populate/Zero options
	this.options = options ? options : {};

	this.init();
};


/**
 *  @brief Slider initiation function.
 *
 *  @details Fetches slides, builds options from defaults and submitted, adds event listeners.
 */
PureSlider.prototype.init = function(){

	// Populate options with default values for unset properties,
	for( var property in this.defaults ){
		if( this.defaults.hasOwnProperty( property ) && !this.options.hasOwnProperty(property) )
			this.options[property] = this.defaults[property];
	}

	// Fetch slides.
	this.slides = this.container.querySelectorAll( this.options.slideNode );

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
	this.container.addEventListener( 'click', function( event ){
		event.preventDefault();

		switch( true ){
			case event.target.matches( self.options.nextButton ):
				self.next(true);
				break;

			case event.target.matches( self.options.prevButton ):
				self.prev(true);
				break;
		}
	});

	// Mouse is hovering over stage.
	this.container.addEventListener( 'mouseover', function(){
		self.isFocused = true;
	});

	// Mouse is leaving the stage.
	this.container.addEventListener( 'mouseleave', function(){
		self.isFocused = false;

		if(!self.isRunning)
			self.run();
	});

	// Force a reflow...
	this.reflow();

	// then run the loop if autorun is enabled,
	if(this.options.autorun)
	{
		this.currentIndex--;
		this.run();
	}
	// or just activate the first slide.
	else
		this.slides[0].classList.add( this.options.activeClass );
};


/**
 *  @brief Gets transition duration of a slide
 *
 *  @param [in] slide element.
 *
 *  @return returns a number of miliseconds
 *
 *  @details Gets a string of durations of all transitioning elements,
 *  parses it to an array of numbers and returns the number of miliseconds of the longest one.
 *  Used to determine how long will the transition take so when to run the idle (slide duration) loop part,
 */
PureSlider.prototype.getTransitionDuration = function( elt ){
	var durations = getComputedStyle( elt )['transition-duration'].toLowerCase().split(',').map( function( duration ){
		return ( duration.indexOf("ms") > -1 ) ? parseFloat( duration ) : parseFloat( duration ) * 1000;
	});

	return Math.max.apply( null, durations );
};


/**
 *  @brief Runs the idle part of the loop.
 *
 *  @details After the slide idle duration runs the slide cycle loop.
 */
PureSlider.prototype.idle = function(){
	this.loop = setTimeout( this.run.bind(this), this.options.slideDuration );
};


/**
 *  @brief Runs the slide cycle loop.
 *
 *  @details Checks if all conditions for running the loop are met.
 *  If so, sets the run flag and switches slides to next one.
 *  If slider autorun is disabled or stage has focus, disables the run flag and stops.
 */
PureSlider.prototype.run = function(){
	if(!this.options.autorun || (this.options.pauseOnFocus && this.isFocused))
	{
		this.isRunning = false;
		return;
	}

	this.isRunning = true;
	this.next();
};


/**
 *  @brief Stops the slide cycle loop.
 *
 *  @details Note that loop will restart if next/prev is executed,
 *  unless this.options.autorun is set to false.
 */
PureSlider.prototype.stop = function(){
	clearTimeout( this.loop );
	this.isRunning = false;
}


/**
 *  @brief Gets a slide relative to current index.
 *
 *  @param [in] relativeOrder - takes a number as relativity factor where 0 means current,
 *  1 means one forward (next),
 *  2 means two forward,
 *  -1 means one backward (previous), and so on.
 * 
 *  @return returns a slide pointed by relativeOrder
 */
PureSlider.prototype.getSlide = function(relativeOrder){
	var	n = this.currentIndex + relativeOrder,
		l = this.slides.length;

	/* JavaScript implementation of Modulo throws negative numbers
	 * from negative dividends. In this case this needs to be fixed.
	 * Algorhythm taken from http://javascript.about.com/od/problemsolving/a/modulobug.htm
	 */
	return this.slides[ ((n % l) + l) % l ];
};


/**
 *  @brief Shifts current slide with next/previous slide.
 *
 *  @param [in] isToggled - boolean. If true, means that slide switch was made by user.
 *
 *  @details Fetches current and next/previous slide and feeds it to the animation function
 *  along with isToggled param, then insreases/decreases the index.
 */
PureSlider.prototype.next = function(isToggled){
	this.animate(this.getSlide(0), this.getSlide(1), isToggled);
	this.currentIndex++;
};
PureSlider.prototype.prev = function(isToggled){
	this.animate(this.getSlide(0), this.getSlide(-1), isToggled);
	this.currentIndex--;
};


/**
 *  @brief Turns slides on and off.
 *
 *  @param [in] current - currently active slide element to deactivate,
 *  @param [in] next - next slide element to activate,
 *  @param [in] isToggled - boolean indicating if slide switch was ordered by user.
 */
PureSlider.prototype.animate = function(current, next, isToggled){

	var
		on      = this.options.activeClass,
		toggle  = this.options.toggleClass;

	if(isToggled)
	{
		clearTimeout( this.loop );

		for( var i = 0; i < this.slides.length; i++ )
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

	this.isRunning = true;
	this.loop = setTimeout( this.idle.bind(this), this.getTransitionDuration(next) );
};


/**
 *  @brief Removes navigation controls. Useful if there's less than 2 slides on stage.
 */
PureSlider.prototype.removeNavigation = function(){
	Array.prototype.forEach.call( this.container.querySelectorAll( this.options.prevButton + ', ' + this.options.nextButton ), function(elt){
		elt.parentNode.removeChild(elt);
	});
};


/**
 *  @brief Forces browser to do a repaint.
 *  @return returns the offsetHeight of container.
 *  @details Hack is necessary in Firefox to force proper transition of first slide.
 */
PureSlider.prototype.reflow = function(){
	return this.container.offsetHeight;
};




// jQuery-compatible libraries adapter
(function($){
	if($ !== undefined){
		$.fn.pureSlider = function(options){

			return this.toArray().forEach( function(elt){
				PureSlider( elt, options );
			});
		}
	}
})(this.$ || this.cash || this.jQuery || this.Zepto || this.jBone);
