# pureSlider
A slider as simple and lightweight as it can be. Provide two css classes with transition, a container with whatever you want to slide and it will slide it in a timely fashion.

### Advantages
- truly lightweight, just a few lines of code,
- compatible with both jQuery and Zepto,
- does what is absolutely necessary and nothing more,
- no ugly inline styling, apart from z-index,
- doltishly easy to integrate with any kind of html generator,
- not restricting you to preprogrammed effects or markup pattern, *you* design the effects used on *your* markup.

### Disadvantages
- won't do anything for you, infact it does very littly on its own,
- not a tool for the braindead or the lazy, this ain't an "everything & the kitchen sink" solution.

### Why?
I needed a simple slider for page hero banner. While there are dozens of those out there, none of them worked for me because of many reasons: too bulky, hard to integrate in my projects, not responsive, generated lots of javascript (mis)calculated inline crap styling that was breaking the page layout or the actual slider content they supposed to render or finally requiring some special markup pattern that was, again, conflicting with the prepared layout.

That's why I made my own, based on what's already available - CSS transitions.
