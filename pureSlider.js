'use strict'

;(function($){
	$.fn.pureSlider = function(options) {

		var pureSlider = function(container, options) {

			// self-reference
			var self = this;
			// container with slides
			self.container = container;

			// setTimeout/setInterval handle
			self.loop = false;

			// current slide
			self.currentIndex = 0;

			// duration of slide interval + slide transition
			self.trueSlideDuration = 0;

			// First slide needs just the slide duration without transition.
			self.firstRun = true;
			self.defaults = {

				//animDuration:  1,
				slideDuration:  2000,
				slideNode: 'div.slide',
				nextButton: '.next',
				prevButton: '.prev',
				activeClass: 'active',
				altActiveClass: 'activated',
				inactiveClass: 'deactivated',


				/**
				 * Show slide switches? TODO - needs implementing, currently does nothing
				 */
				//showSlideButtons: true,

				/**
				 *  Autoinit sliding? TODO - needs implementing, currently does nothing
				 */
				//autorun: true,

				/**
				 *  Random init? TODO - needs implementing, currently does nothing
				 */
				//randominit: false
			};

			self.options = options;

			for( var property in self.defaults ) {
				if (self.defaults.hasOwnProperty(property) && !self.options.hasOwnProperty(property))
					self.options[property] = self.defaults[property];
			}

			self.elements = container.querySelectorAll( self.options.slideNode );

			self.init = function() {

				// If there are no elements  on stage, remove all navigation
				// and don't run the loop.
				if( self.elements.length < 1 )
				{
					self.removeNavigation();
					return;
				}

				self.elements[0].classList.add( self.options.activeClass );

				// If there's only one slide, remove all navigation
				// and don't run the loop.
				if( self.elements.length == 1 )
				{
					self.removeNavigation();
					return;
				}

				// If there's more than one slide, leave the navigation elements intact,
				// register events on it, and run the loop.

				self.trueSlideDuration = self.options.slideDuration + self.getTransitionDuration( self.elements[0] );
				self.runLoop();

				var nextButton = self.container.querySelector( self.options.nextButton );
				var prevButton = self.container.querySelector( self.options.prevButton );

				if( nextButton !== null )
				{
					nextButton.addEventListener('click', function(e){
						e.preventDefault();
						self.stopLoop();
						self.next(true);
						self.runLoop();
					});
				}

				if( prevButton !== null )
				{
					prevButton.addEventListener('click', function(e){
						e.preventDefault();
						self.stopLoop();
						self.prev(true);
						self.runLoop();
					});
				}

			}


			self.getTransitionDuration = function(elt){
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
						// Get numerical part from string. Parse numerical string to number.
						// If number was not defined as miliseconds, then convert it to miliseconds.
						duration = (durStrings[i].indexOf("ms")>-1) ? parseFloat(durStrings[i]) : parseFloat(durStrings[i])*1000;

						// As transition may have many durations, we care only for the longest one.
						longest = duration > longest ? duration : longest;
					}
				}

				return longest;
			};


			self.runLoop = function() {

				if(self.firstRun){
					self.loop = setTimeout( function() {
						self.next();
						self.runLoop();
					}, self.options.slideDuration );
					self.firstRun = false;
				}
				else {
					self.loop = setInterval( function() {
						self.next();
					}, self.trueSlideDuration );
				}
			}


			self.animate = function(current, next, activated) {

				activated = activated === true ? true : false;

				if(activated)
				{
					for( var i = 0; i < self.elements.length; i++ )
					{
						self.elements[i].classList.add( self.options.inactiveClass );
					}
					next.classList.remove( self.options.inactiveClass );
					next.classList.add( self.options.altActiveClass );
				}
				else
				{
					for( var i = 0; i < self.elements.length; i++ )
					{
						self.elements[i].classList.remove( self.options.inactiveClass );
					}
					next.classList.add( self.options.activeClass );
				}
				current.classList.remove( self.options.altActiveClass );
				current.classList.remove( self.options.activeClass );
			};


			self.next = function(activated) {
				var next 	= null;
				var current = null;

				if(self.elements[self.currentIndex + 1])
				{
					next 	= self.elements[self.currentIndex + 1];
					current = self.elements[self.currentIndex];
					self.currentIndex++;
				}
				else
				{
					next 	= self.elements[0];
					current = self.elements[self.currentIndex];
					self.currentIndex = 0;
				}

				self.animate(current, next, activated);
			}

			self.prev = function(activated) {
				var next 	= null;
				var current = null;

				if(self.elements[self.currentIndex - 1])
				{
					next 	= self.elements[self.currentIndex - 1];
					current = self.elements[self.currentIndex];
					self.currentIndex--;
				}
				else
				{
					next 	= self.elements[self.elements.length - 1];
					current = self.elements[self.currentIndex];
					self.currentIndex = self.elements.length - 1;
				}

				self.animate(current, next, activated);
			}


			self.stopLoop = function(){
				clearInterval(self.loop);
				clearTimeout(self.loop);
				self.firstRun = true;
			}


			self.removeNavigation = function(){
				Array.prototype.forEach.call( self.container.querySelectorAll( self.options.prevButton + ', ' + self.options.nextButton ), function(elt){
					elt.parentNode.removeChild(elt);
				});
			}
		};


		return this.toArray().forEach(function(elt) {
			var main = new pureSlider( elt, options );
			main.init();
		});
	}
})(this.jQuery || this.Zepto || this.jBone);
