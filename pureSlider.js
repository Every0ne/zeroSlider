'use strict';

var Marker = function() {
	
	this.getStamp = function() {
		var d = new Date();
		return d.getTime();
	}

	this.stamp = this.getStamp();
	this.now = 0;
	this.difference = 0;
}

Marker.prototype.mark = function(){
	this.now = this.getStamp();
	this.difference = this.now - this.stamp;
	console.log(this.difference);
	this.stamp = this.getStamp();
}


var PureSlider = function(container, options) {

	if( !( this instanceof PureSlider ) ){
		return new PureSlider(container, options);
	}

	// self-reference - a bit of a hack
	this.me = this;

	// container with slides
	this.container = container;

	// DEBUG marker displaying time passed since last call
	this.marker = new Marker();
	this.marker.mark();

	// setTimeout/setInterval handle
	this.loop = false;

	// current index for prev/current/next slide determination
	this.currentIndex = 0;

	// duration of slide interval + slide transition
	this.trueSlideDuration = 0;

	// First slide needs just the slide duration without transition.
	this.firstRun = true;

	// Default options
	this.defaults = {

		slideDuration:  2000,
		slideNode: 'div.slide',
		nextButton: '.next',
		prevButton: '.prev',
		activeClass: 'on',
		toggleClass: 'toggled',
		autorun: true,

		/**
		 * Show slide switches? TODO - needs implementing, currently does nothing
		 */
		//showSlideButtons: true,

		/**
		 *  Random init? TODO - needs implementing, currently does nothing
		 */
		//randomStart: false
	};

	// Populate/Zero options
	this.options = options ? options : {};

	// Populate options with default values for unset properties
	for( var property in this.defaults ) {
		if( this.defaults.hasOwnProperty(property) && !this.options.hasOwnProperty(property) )
			this.options[property] = this.defaults[property];
	}

	this.elements = this.container.querySelectorAll( this.options.slideNode );

	this.init();
};


PureSlider.prototype.init = function() {

	// If there are no elements on stage, remove all navigation
	// and don't run the loop.
	if( this.elements.length < 1 )
	{
		this.removeNavigation();
		return;
	}

	// First condition not met, so there's at least one element,
	// this one should get activated.
	this.elements[0].classList.add( this.options.activeClass );

	// If there's only one slide, remove all navigation
	// and don't run the loop.
	if( this.elements.length == 1 )
	{
		this.removeNavigation();
		return;
	}

	// If there's more than one slide, leave the navigation elements intact,
	// register events on it, and run the loop.
	this.trueSlideDuration = this.options.slideDuration + this.getTransitionDuration( this.elements[0] );

	var self = this.me;

	this.container.addEventListener('click', function(e){
		e.preventDefault();
		
		switch(true){
			
			case e.target.matches( self.options.nextButton ):
				self.stopLoop();
				self.next(true);
				self.runLoop();
				break;

			case e.target.matches( self.options.prevButton ):
				self.stopLoop();
				self.prev(true);
				self.runLoop();
				break;
		}
	});

	if(this.options.autorun)
		this.runLoop();
}


PureSlider.prototype.getTransitionDuration = function(elt){
	var duration, longest = 0;

	// Get transition property from css of element.
	var durStrings = getComputedStyle(elt)['transition-duration'];

	if(durStrings !== undefined)
	{
		// Remove spaces, text-transform to lowercase and split several values to array.
		durStrings = durStrings.replace(/\s/g, '').toLowerCase().split(',');

		// If there was a single value, transform to array anyway for easier processing.
		if(durStrings.constructor !== Array)
			durStrings = [durStrings];

		for(var i = 0; i < durStrings.length; i++)
		{
			// Check if defined as miliseconds.
			// Get numerical part from string and parse it to number.
			// If number was not defined as miliseconds, then convert it to miliseconds.
			duration = ( durStrings[i].indexOf("ms") > -1 ) ? parseFloat( durStrings[i] ) : parseFloat( durStrings[i] ) * 1000;

			// As transition may have many durations, we care only for the longest one.
			longest = duration > longest ? duration : longest;
		}
	}

	return longest;
};


PureSlider.prototype.runLoop = function() {
	var self = this.me;

	if( this.firstRun ){
		this.loop = setTimeout( function() {
			self.next();
			self.runLoop();
			self.marker.mark();
		}, this.options.slideDuration );
		this.firstRun = false;
	}
	else {
		this.loop = setInterval( function() {
		self.next();
		self.marker.mark();
		}, this.trueSlideDuration );
	}
}


PureSlider.prototype.animate = function(current, next, activated) {

	activated = activated === true ? true : false;

	if(activated)
	{
		for( var i = 0; i < this.elements.length; i++ )
		{
			this.elements[i].classList.add( this.options.toggleClass );
		}
		next.classList.add( this.options.activeClass );
		current.classList.remove( this.options.activeClass );
	}
	else
	{
		next.classList.remove( this.options.toggleClass );
		next.classList.add( this.options.activeClass );
		current.classList.remove( this.options.activeClass, this.options.toggleClass );
	}
};


/* Gets a slide relative to current index.
 * takes a number as relativity factor
 * where 0 means current,
 * 1 means one forward (next),
 * 2 means two forward,
 * -1 means one backward (previous),
 * and so on.
 */
PureSlider.prototype.getSlide = function(relativeOrder) {
	var	n = this.currentIndex + relativeOrder,
		l = this.elements.length;

	/* JavaScript implementation of Modulo throws negative numbers
	 * from negative dividends. In this case this needs to be fixed.
	 * Algorhythm taken from http://javascript.about.com/od/problemsolving/a/modulobug.htm
	 */
	return this.elements[ ((n % l) + l) % l ];
}


PureSlider.prototype.next = function(activated) {
	console.log('Current index: ' + this.currentIndex); // DEBUG!
	this.animate(this.getSlide(0), this.getSlide(1), activated);
	this.currentIndex++;
};


PureSlider.prototype.prev = function(activated) {
	console.log('Current index: ' + this.currentIndex); // DEBUG!
	this.animate(this.getSlide(0), this.getSlide(-1), activated);
	this.currentIndex--;
};


PureSlider.prototype.stopLoop = function(){
	clearInterval(this.loop);
	clearTimeout(this.loop);
	this.firstRun = true;
};


PureSlider.prototype.removeNavigation = function(){
	Array.prototype.forEach.call( this.container.querySelectorAll( this.options.prevButton + ', ' + this.options.nextButton ), function(elt){
		elt.parentNode.removeChild(elt);
	});
};


// jQuery-compatible libraries adapter
(function($){
	if($ !== undefined){
		$.fn.pureSlider = function(options) {

			return this.toArray().forEach( function(elt) {
				PureSlider( elt, options );
			});
		}
	}
})(this.$ || this.cash || this.jQuery || this.Zepto || this.jBone);
