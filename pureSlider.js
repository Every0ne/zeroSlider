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
				 * Czy pokazywać nawigację "Lewo", "Prawo"?
				 */
				showNavigation: false,

				/**
				 * Czy pokazywać przyciski zmiany slajdów?
				 */
				showSlideButtons: true,

				/**
				 *  Czy automatycznie przesuwać slider?
				 */
				autorun: true,

				/**
				 *  Czy startować losowo?
				 */
				randomStart: false
			}

			this.options = $.extend(this.defaultOptions, this.options);
			this.elements = this.container.find( this.options.slideNode ).toArray();

			this.start = function() {
				var convertedElements = [];

				for( var i in this.elements )
				{
					convertedElements.push( $( this.elements[i] ) );
					convertedElements[i].css('z-index', this.elements.length - i);
				}
				this.elements = convertedElements;

				this.elements[0].addClass( this.options.activeClass );
				this.runLoop();

				/* Przykład na pętlę bez iteratora po wszystkich elementach
				var current = this.elements.shift();
				this.elements.each( function(i) {
					$(this);
				})*/
			}


			this.runLoop = function() {
				self = this;
				this.loop = setInterval( function() {
					self.prev();
				}, this.options.slideDuration )
			}


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


			this.animate = function(current, next) {
				
				next.css('z-index', this.elements.length )
				current.css('z-index', 1);
				next.addClass('active');

				setTimeout(function() {
					current.removeClass('active');
				}, this.options.animDuration);
			};


			/* Zdarzenia tu się zdarzają. */
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

		/* Zwracamy slajder dla każdego z itemów zselekconych selektorem. */
		return this.each(function() {
			var main = new pureSlider( $(this), options );
			main.start();
		});
	}
})(this.jQuery || this.Zepto || this.jBone);