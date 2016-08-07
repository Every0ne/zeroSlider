'use strict';

var PureSlider = function( container, options ){

	if( !( this instanceof PureSlider ) ){
		return new PureSlider(container, options);
	}

	// self-reference - a bit of a hack
	this.me = this;

	// container with slides
	this.container = container;

	// setTimeout/setInterval handle
	this.loop = false;

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

	this.events = {
		transitionOnBegin :  new Event( 'ps:transition.on.begin' ),
		transitionOnEnd :    new Event( 'ps:transition.on.end' ),
		transitionOffBegin : new Event( 'ps:transition.off.begin' ),
		transitionOffEnd :   new Event( 'ps:transition.off.end' ),
		slideDurationBegin : new Event( 'ps:slide.duration.begin' ),
		slideDurationEnd :   new Event( 'ps:slide.duration.end' ),
	}

	// Flags
	this.isRunning = true;
	this.isFocused = false;

	// Populate/Zero options
	this.options = options ? options : {};

	// Populate options with default values for unset properties
	for( var property in this.defaults ){
		if( this.defaults.hasOwnProperty( property ) && !this.options.hasOwnProperty(property) )
			this.options[property] = this.defaults[property];
	}

	this.slides = this.container.querySelectorAll( this.options.slideNode );

	this.init();
};


PureSlider.prototype.init = function(){

	// If there are no elements on stage, remove all navigation controls and stop.
	if( this.slides.length < 1 )
	{
		this.removeNavigation();
		return;
	}

	// First condition not met, so there's at least one element,
	// this one should get activated.
	this.reflow();
	this.slides[0].classList.add( this.options.activeClass );

	// If there's only one slide, remove all navigation
	// and don't run the loop.
	if( this.slides.length == 1 )
	{
		this.removeNavigation();
		return;
	}

	// If there's more than one slide, leave the navigation elements intact,
	// register events on it, and run the loop.

	var self = this.me;

	this.container.addEventListener( 'click', function( event ){
		event.preventDefault();

		switch( true ){

			case event.target.matches( self.options.nextButton ):
				self.next( true );
				break;

			case event.target.matches( self.options.prevButton ):
				self.prev( true );
				break;
		}
	});

	// mouse is hovering over stage
	this.container.addEventListener( 'mouseover', function(){
		self.isFocused = true;
	});

	// mouse is leaving the stage
	this.container.addEventListener( 'mouseout', function(){
		self.isFocused = false;
		if(!self.isRunning)
			self.container.dispatchEvent( 'ps:slide.duration.end' );
	});

	this.container.addEventListener( 'ps:transition.on.end', function( e ){
		setTimeout( function(){
			self.container.dispatchEvent( self.events.slideDurationEnd )
		}, self.options.slideDuration );
	});

	this.container.addEventListener( 'ps:slide.duration.end', function(){
		if(!this.options.autorun || (this.options.pauseOnFocus && this.isFocused))
		{
			self.isRunning = false;
			return;
		}

		self.isRunning = true;
		self.next();
	});
};


/**
 * @brief Gets a slide relative to current index.
 * 
 * @param [in] relativeOrder - takes a number as relativity factor where 0 means current,
 * 1 means one forward ( next ),
 * 2 means two forward,
 * -1 means one backward ( previous ), and so on.
 * @return returns a slide pointed by relativeOrder
 * 
 * @details Details
 */
PureSlider.prototype.getSlide = function( relativeOrder ){
	var	n = this.currentIndex + relativeOrder,
		l = this.slides.length;

	/* JavaScript implementation of Modulo throws negative numbers
	 * from negative dividends. In this case this needs to be fixed.
	 * Algorhythm taken from http://javascript.about.com/od/problemsolving/a/modulobug.htm
	 */
	return this.slides[ ( ( n % l ) + l ) % l ];
};


PureSlider.prototype.next = function( isToggled ){
	this.animate( this.getSlide( 0 ), this.getSlide( 1 ), isToggled );
	this.currentIndex++;
};


PureSlider.prototype.prev = function( isToggled ){
	this.animate( this.getSlide( 0 ), this.getSlide( -1 ), isToggled );
	this.currentIndex--;
};


PureSlider.prototype.animate = function( current, next, isToggled ){

	var
		on = this.options.activeClass,
		toggle = this.options.toggleClass;

	if( isToggled === true )
	{
		for( var i = 0; i < this.slides.length; i++ )
		{
			this.slides[i].classList.add( toggle );
		}
		next.classList.add( on );
		current.classList.remove( on );
	}
	else
	{
		next.classList.remove( toggle );
		next.classList.add( on );
		current.classList.remove( on, toggle );
	}

	this.announceTransitionEnd( next );
};


PureSlider.prototype.addTransitionsEndListener = function( slide ){
	var
		transitionProp = getComputedStyle( slide, null )['transition-property'] || '',
		transitionCount = transitionProp.split( ',' ).length,
		self = this.me;

	console.log('Transitition: Props: ' + transitionProp + '; Count: ' + transitionCount + ';');

	function countdown( event ){
		console.log( 'Done: ' + event.propertyName );
		transitionCount--;

		if( transitionCount <= 0 )
		{
			console.log( 'All transitions finished' );
			slide.removeEventListener( 'transitionend', countdown );
			self.container.dispatchEvent( self.events.transitionOnEnd );
		}
	}

	slide.addEventListener( 'transitionend', countdown )
};


/**
 * @brief Forces browser to do a repaint.
 * @return returns the offsetHeight of container.
 * @details Hack is necessary in Firefox to force proper transition of first slide.
 */
PureSlider.prototype.reflow = function(){
	return this.container.offsetHeight;
};


PureSlider.prototype.removeNavigation = function(){
	Array.prototype.forEach.call( this.container.querySelectorAll( this.options.prevButton + ', ' + this.options.nextButton ), function( elt ){
		elt.parentNode.removeChild( elt );
	});
};


// jQuery-compatible libraries adapter
( function( $ ){
	if( $ !== undefined ){
		$.fn.pureSlider = function( options ){

			return this.toArray().forEach( function( elt ){
				PureSlider( elt, options );
			});
		}
	}
})( this.$ || this.cash || this.jQuery || this.Zepto || this.jBone );
