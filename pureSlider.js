// parseFloat($('.someclass').css('transition-duration')) * 1000    -this will be useful in the future.
;(function($){
	$.fn.pureSlider = function(options) {

		var pureSlider = function(container, options) {

			this.container = container;
			this.loop = false;
			this.options = options;
			this.currentIndex = 0;
			this.defaultOptions = {

				animDuration:  500,
				slideDuration:  2500,
				slideNode: 'div.slide',
				nextButton: '.ns-next',
				prevButton: '.ns-prev',
				activeClass: 'active',

				/**
				 * Show "Left", "Right" navigation?
				 */
				showNavigation: false,

				/**
				 * Show slide switches? TODO - needs implementing, currently does nothing
				 */
				showSlideButtons: true,

				/**
				 *  Autostart sliding? TODO - needs implementing, currently does nothing
				 */
				autorun: true,

				/**
				 *  Random start? TODO - needs implementing, currently does nothing
				 */
				randomStart: false
			}

			this.options = $.extend(this.defaultOptions, this.options);
			this.elements = this.container.find( this.options.slideNode ).toArray();

			//console.log ( this.container );
			//console.log ( this.elements );
			
			this.start = function() {
				var convertedElements = [];

				for( var i in this.elements )
				{
					convertedElements.push( $( this.elements[i] ) );
					convertedElements[i].css('z-index', 1);
				}
				this.elements = convertedElements;

				this.elements[0].css('z-index', this.elements.length ).addClass( this.options.activeClass );
				this.runLoop();

				/* easy iterate over all elements
				var current = this.elements.shift();
				this.elements.each( function(i) {
					$(this);
				})*/
			}


			this.runLoop = function() {
				self = this;
				this.loop = setInterval( function() {
					self.next();
				}, this.options.slideDuration )
			}


			this.animate = function(current, next) {
				next.css('z-index', this.elements.length )
				current.css('z-index', 1);
				next.addClass('active');

				setTimeout(function() {
					current.removeClass('active');
				}, this.options.animDuration);
			};


			this.next = function() {
				var next 	= null;
				var current = null;

				if(this.elements[this.currentIndex + 1])
				{
					next 	= this.elements[this.currentIndex + 1];
					current = this.elements[this.currentIndex];
					this.currentIndex++;
				}
				else
				{
					next 	= this.elements[0];
					current = this.elements[this.currentIndex];
					this.currentIndex = 0;
				}

				this.animate(current, next);
			}

			this.prev = function() {
				var next 	= null;
				var current = null;

				if(this.elements[this.currentIndex - 1])
				{
					next 	= this.elements[this.currentIndex - 1];
					current = this.elements[this.currentIndex];
					this.currentIndex--;
				}
				else
				{
					next 	= this.elements[this.elements.length - 1];
					current = this.elements[this.currentIndex];
					this.currentIndex = this.elements.length - 1;
				}

				this.animate(current, next);
			}


			/* Events do happen in here. */
			var self = this;
			//console.log($(this.container).find( this.options.nextButton ));

			$(this.container).find( this.options.nextButton ).on('click', function(){
				clearInterval(self.loop);
				self.next();
				self.runLoop();
			});

			$(this.container).find( this.options.prevButton ).on('click', function(){
				clearInterval(self.loop)
				self.prev()
				self.runLoop()
			});
		};

		/* Return a slider for each of the items got by the selector. */
		
		/* jBone forEach hack that is not working
		if (typeof this.forEach == 'function') {
			this.each = this.forEach;
		}*/

		
		return this.each(function() {
			//console.log( this );
			var main = new pureSlider( $(this), options );
			main.start();
		});
	}
})(this.jQuery || this.Zepto/* || this.jBone*/);