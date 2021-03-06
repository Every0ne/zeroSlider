# zeroSlider
A slider as simple and lightweight as it can be. Provide some css classes with transition, a container with whatever you want to slide and it will slide it in a timely fashion.

## Advantages?
- lightweight,
- ~~cash, jBone, jQuery and Zepto compatible~~ completely library-agnostic, with an "adapter" so that it can be used with any jQuery-compatible library,
- does what is absolutely necessary and nothing more,
- no ugly inline styling,
- doltishly easy to integrate with any kind of html generator,
- not restricting you to preprogrammed effects or markup pattern, *you* design the effects used on *your* markup.

## Disadvantages?
- won't do anything for you, infact it does very little on its own,
- not a tool for the braindead or the lazy, this ain't an "everything & the kitchen sink" solution.

## How?
Include zeroSlider.js in your document, then:
- get some basic markup:

```html
<div class="stage">
	<div class="slide first"></div>
	<div class="slide second"></div>
	<div class="slide third"></div>
</div>
```
- add a bit of CSS:

```css
.stage {
  width: 300px;
  height: 200px;
  margin: 30px auto;
  position: relative;
}

.slide {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: all 1s linear;
}

.slide.on {
  opacity: 1;
  transition: all 1s linear;
}

.slide.first {background: #f00}
.slide.second {background: #0f0}
.slide.third {background: #00f}
```

- run zeroSlider, feeding it the "stage" DOM element either as node or just a selector string:

```javascript
// like this:
ZeroSlider(document.querySelector('.stage'));

// or this:
ZeroSlider('.stage');

// or like this if you have a jQuery-like library:
$('.stage').zeroSlider();
```

- enjoy!

## Options?
Why not? Here, take a look at defaults:

```javascript
var slider = ZeroSlider( <stage>, { // "Stage" housing slides and controls. Can be a DOM node or a selector string.
	slideDuration:  2000, // How much time passes between slide switch
	slideNode: 'div.slide', // Nodes inside <stage> to use as slide
	nextButton: '.next', // Node inside <stage> to use as next slide button
	prevButton: '.prev', // Node inside <stage> to use as previous slide button
	activeClass: 'on', // Currently active slide is given this class
	toggleClass: 'toggle', // Class attached additionally to user-activated/deactivated slides
	autorun: true, // loop slides since start or not?
	pauseOnFocus: true, // will mouse-hovering over stage halt slide switching?
});
```
Aditionally having a reference to the slider gives more control over it, so it's possible to `slider.next()`, `slider.prev()`, `slider.run()`, `slider.stop()` and such, whenever there's a need for such fancities.

It's also possible to change slider's behavior realtime by adjusting its options, for instance `slider.options.autorun = false` will stop automatic slide switching and `slider.options.pauseOnFocus = false` won't halt the slider when mouse hovers over the stage.

A proper demo page with more examples is in the works. Meanwhile for more details take a look at HTML and CSS in the package. Everything should be pretty straight-forward.

## Why?
I needed a simple slider for page hero banner. While there are dozens of those out there, none of them worked for me because of many reasons: too bulky, hard to integrate in my projects, not responsive, generated lots of javascript (mis)calculated inline crap styling that was breaking the page layout or the actual slider content they supposed to render or finally requiring some special markup pattern that was, again, conflicting with the prepared layout.

That's why I made my own, based on what's already available - CSS transitions.

## TODO?
zeroSlider is still missing a few features that I want to integrate as soon as I have some time to spare:
- random start,
- support for more slide states for transitions (in/out maybe?),
- navdots
- multislide
- make a proper landing page with example CSS transition classes,
- tidy up the code (never-ending task).
