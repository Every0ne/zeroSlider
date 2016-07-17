# pureSlider
A slider as simple and lightweight as it can be. Provide some css classes with transition, a container with whatever you want to slide and it will slide it in a timely fashion.

### Advantages?
- lightweight,
- ~~cash, jBone, jQuery and Zepto compatible~~ completely library-agnostic, with an "adapter" so that it can be used with any jQuery-compatible library,
- does what is absolutely necessary and nothing more,
- no ugly inline styling,
- doltishly easy to integrate with any kind of html generator,
- not restricting you to preprogrammed effects or markup pattern, *you* design the effects used on *your* markup.

### Disadvantages?
- won't do anything for you, infact it does very littly on its own,
- not a tool for the braindead or the lazy, this ain't an "everything & the kitchen sink" solution.

### How?
Include pureSlider.js in your document, then:
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

.slide.active {
  opacity: 1;
  transition: all 1s linear;
}

.slide.first {background: #f00}
.slide.second {background: #0f0}
.slide.third {background: #00f}
```

- run pureSlider, feeding it the "stage" DOM element:
```javascript
PureSlider(document.querySelector('.stage'));
```

- enjoy!

### Options?
Why not? Here, take a look at defaults:
```javascript
var slider = PureSlider( <element>, {
	slideDuration:  2000, // How much time passes between slide switch
	slideNode: 'div.slide', // Nodes inside <element> to use as slide
	nextButton: '.next', // Node inside <element> to use as next slide button
	prevButton: '.prev', // Node inside <element> to use as previous slide button
	activeClass: 'active', // Currently active slide is given this class
	altActiveClass: 'active', // Slide activated by pressing next/prev button is given this class
	inactiveClass: '', // Slides deactivated by manually switching a slide are given this class
	autorun: true, // loop slides since start or not?
});
```
Aditionally having a reference to the slider gives more control over it, so it's possible to `slider.next()`, `slider.prev()`, `slider.stopLoop()`, `slider.runLoop()` and such, whenever there's a need for such fancities.

A proper demo page with more examples is in the works. Meanwhile for more details take a look at HTML and CSS in the package. Everything should be pretty straight-forward.

### Why?
I needed a simple slider for page hero banner. While there are dozens of those out there, none of them worked for me because of many reasons: too bulky, hard to integrate in my projects, not responsive, generated lots of javascript (mis)calculated inline crap styling that was breaking the page layout or the actual slider content they supposed to render or finally requiring some special markup pattern that was, again, conflicting with the prepared layout.

That's why I made my own, based on what's already available - CSS transitions.

### TODO?
pureSlider is still missing a few features that I want to integrate as soon as I have some time to spare:
- disable autosliding,
- random start,
- support for more slide states for transitions,
- make a proper landing page with example CSS transition classes,
- tidy up the code.
