"use strict";/*! cash-dom 1.3.4, https://github.com/kenwheeler/cash @license MIT */
!function(t,n){"function"==typeof define&&define.amd?define(n):"undefined"!=typeof exports?module.exports=n():t.cash=t.$=n()}(this,function(){function t(t,n){n=n||w;var e=$.test(t)?n.getElementsByClassName(t.slice(1)):k.test(t)?n.getElementsByTagName(t):n.querySelectorAll(t);return e}function n(t){return E=E||w.createDocumentFragment(),A=A||E.appendChild(w.createElement("div")),A.innerHTML=t,A.childNodes}function e(t){"loading"!==w.readyState?t():w.addEventListener("DOMContentLoaded",t)}function r(r,i){if(!r)return this;if(r.cash&&r!==T)return r;var o,u=r,s=0;if(q(r))u=P.test(r)?w.getElementById(r.slice(1)):_.test(r)?n(r):t(r,i);else if(R(r))return e(r),this;if(!u)return this;if(u.nodeType||u===T)this[0]=u,this.length=1;else for(o=this.length=u.length;o>s;s++)this[s]=u[s];return this}function i(t,n){return new r(t,n)}function o(t,n){for(var e=t.length,r=0;e>r&&n.call(t[r],t[r],r,t)!==!1;r++);}function u(t,n){var e=t&&(t.matches||t.webkitMatchesSelector||t.mozMatchesSelector||t.msMatchesSelector||t.oMatchesSelector);return!!e&&e.call(t,n)}function s(t){return i(M.call(t).filter(function(t,n,e){return e.indexOf(t)===n}))}function c(t){return t[F]=t[F]||{}}function a(t,n,e){return c(t)[n]=e}function f(t,n){var e=c(t);return void 0===e[n]&&(e[n]=t.dataset?t.dataset[n]:i(t).attr("data-"+n)),e[n]}function h(t,n){var e=c(t);e?delete e[n]:t.dataset?delete t.dataset[n]:i(t).removeAttr("data-"+name)}function l(t){return q(t)&&t.match(I)}function d(t,n){return t.classList?t.classList.contains(n):new RegExp("(^| )"+n+"( |$)","gi").test(t.className)}function p(t,n,e){t.classList?t.classList.add(n):e.indexOf(" "+n+" ")&&(t.className+=" "+n)}function v(t,n){t.classList?t.classList.remove(n):t.className=t.className.replace(n,"")}function m(t,n){return parseInt(T.getComputedStyle(t[0],null)[n],10)||0}function g(t,n,e){var r=f(t,"_cashEvents")||a(t,"_cashEvents",{});r[n]=r[n]||[],r[n].push(e),t.addEventListener(n,e)}function y(t,n,e){var r=f(t,"_cashEvents")[n];e?t.removeEventListener(n,e):(o(r,function(e){t.removeEventListener(n,e)}),r=[])}function x(t,n){return"&"+encodeURIComponent(t)+"="+encodeURIComponent(n).replace(/%20/g,"+")}function C(t){return"radio"===t.type||"checkbox"===t.type}function L(t,n,e){if(e){var r=t.childNodes[0];t.insertBefore(n,r)}else t.appendChild(n)}function N(t,n,e){var r=q(n);return!r&&n.length?void o(n,function(n){return N(t,n,e)}):void o(t,r?function(t){return t.insertAdjacentHTML(e?"afterbegin":"beforeend",n)}:function(t,r){return L(t,0===r?n:n.cloneNode(!0),e)})}function b(t,n){return t===n}var E,A,w=document,T=window,S=Array.prototype,M=S.slice,B=S.filter,H=S.push,O=function(){},R=function(t){return typeof t==typeof O},q=function(t){return"string"==typeof t},P=/^#[\w-]*$/,$=/^\.[\w-]*$/,_=/<.+>/,k=/^\w+$/,D=i.fn=i.prototype=r.prototype={constructor:i,cash:!0,length:0,push:H,splice:S.splice,map:S.map,init:r};i.parseHTML=n,i.noop=O,i.isFunction=R,i.isString=q,i.extend=D.extend=function(t){t=t||{};var n=M.call(arguments),e=n.length,r=1;for(1===n.length&&(t=this,r=0);e>r;r++)if(n[r])for(var i in n[r])n[r].hasOwnProperty(i)&&(t[i]=n[r][i]);return t},i.extend({merge:function(t,n){for(var e=+n.length,r=t.length,i=0;e>i;r++,i++)t[r]=n[i];return t.length=r,t},each:o,matches:u,unique:s,isArray:Array.isArray,isNumeric:function(t){return!isNaN(parseFloat(t))&&isFinite(t)}});var F=i.uid="_cash"+Date.now();D.extend({data:function(t,n){if(q(t))return void 0===n?f(this[0],t):this.each(function(e){return a(e,t,n)});for(var e in t)this.data(e,t[e]);return this},removeData:function(t){return this.each(function(n){return h(n,t)})}});var I=/\S+/g;D.extend({addClass:function(t){var n=l(t);return n?this.each(function(t){var e=" "+t.className+" ";o(n,function(n){p(t,n,e)})}):this},attr:function(t,n){if(t){if(q(t))return void 0===n?this[0]?this[0].getAttribute?this[0].getAttribute(t):this[0][t]:void 0:this.each(function(e){e.setAttribute?e.setAttribute(t,n):e[t]=n});for(var e in t)this.attr(e,t[e]);return this}},hasClass:function(t){var n=!1,e=l(t);return e&&e.length&&this.each(function(t){return n=d(t,e[0]),!n}),n},prop:function(t,n){if(q(t))return void 0===n?this[0][t]:this.each(function(e){e[t]=n});for(var e in t)this.prop(e,t[e]);return this},removeAttr:function(t){return this.each(function(n){n.removeAttribute?n.removeAttribute(t):delete n[t]})},removeClass:function(t){if(!arguments.length)return this.attr("class","");var n=l(t);return n?this.each(function(t){o(n,function(n){v(t,n)})}):this},removeProp:function(t){return this.each(function(n){delete n[t]})},toggleClass:function(t,n){if(void 0!==n)return this[n?"addClass":"removeClass"](t);var e=l(t);return e?this.each(function(t){var n=" "+t.className+" ";o(e,function(e){d(t,e)?v(t,e):p(t,e,n)})}):this}}),D.extend({add:function(t,n){return s(i.merge(this,i(t,n)))},each:function(t){return o(this,t),this},eq:function(t){return i(this.get(t))},filter:function(t){return i(B.call(this,q(t)?function(n){return u(n,t)}:t))},first:function(){return this.eq(0)},get:function(t){return void 0===t?M.call(this):0>t?this[t+this.length]:this[t]},index:function(t){var n=t?i(t)[0]:this[0],e=t?this:i(n).parent().children();return M.call(e).indexOf(n)},last:function(){return this.eq(-1)}});var U=function(){var t=/(?:^\w|[A-Z]|\b\w)/g,n=/[\s-_]+/g;return function(e){return e.replace(t,function(t,n){return t[0===n?"toLowerCase":"toUpperCase"]()}).replace(n,"")}}(),z=function(){var t={},n=document,e=n.createElement("div"),r=e.style;return function(n){if(n=U(n),t[n])return t[n];var e=n.charAt(0).toUpperCase()+n.slice(1),i=["webkit","moz","ms","o"],u=(n+" "+i.join(e+" ")+e).split(" ");return o(u,function(e){return e in r?(t[e]=n=t[n]=e,!1):void 0}),t[n]}}();i.prefixedProp=z,i.camelCase=U,D.extend({css:function(t,n){if(q(t))return t=z(t),arguments.length>1?this.each(function(e){return e.style[t]=n}):T.getComputedStyle(this[0])[t];for(var e in t)this.css(e,t[e]);return this}}),o(["Width","Height"],function(t){var n=t.toLowerCase();D[n]=function(){return this[0].getBoundingClientRect()[n]},D["inner"+t]=function(){return this[0]["client"+t]},D["outer"+t]=function(n){return this[0]["offset"+t]+(n?m(this,"margin"+("Width"===t?"Left":"Top"))+m(this,"margin"+("Width"===t?"Right":"Bottom")):0)}}),D.extend({off:function(t,n){return this.each(function(e){return y(e,t,n)})},on:function(t,n,r,i){var o;if(!q(t)){for(var s in t)this.on(s,n,t[s]);return this}return R(n)&&(r=n,n=null),"ready"===t?(e(r),this):(n&&(o=r,r=function(t){for(var e=t.target;!u(e,n);){if(e===this)return e=!1;e=e.parentNode}e&&o.call(e,t)}),this.each(function(n){var e=r;i&&(e=function(){r.apply(this,arguments),y(n,t,e)}),g(n,t,e)}))},one:function(t,n,e){return this.on(t,n,e,!0)},ready:e,trigger:function(t,n){var e=w.createEvent("HTMLEvents");return e.data=n,e.initEvent(t,!0,!1),this.each(function(t){return t.dispatchEvent(e)})}});var W=["file","reset","submit","button"];D.extend({serialize:function(){var t=this[0].elements,n="";return o(t,function(t){t.name&&W.indexOf(t.type)<0&&("select-multiple"===t.type?o(t.options,function(e){e.selected&&(n+=x(t.name,e.value))}):(!C(t)||C(t)&&t.checked)&&(n+=x(t.name,t.value)))}),n.substr(1)},val:function(t){return void 0===t?this[0].value:this.each(function(n){return n.value=t})}}),D.extend({after:function(t){return i(t).insertAfter(this),this},append:function(t){return N(this,t),this},appendTo:function(t){return N(i(t),this),this},before:function(t){return i(t).insertBefore(this),this},clone:function(){return i(this.map(function(t){return t.cloneNode(!0)}))},empty:function(){return this.html(""),this},html:function(t){if(void 0===t)return this[0].innerHTML;var n=t.nodeType?t[0].outerHTML:t;return this.each(function(t){return t.innerHTML=n})},insertAfter:function(t){var n=this;return i(t).each(function(t,e){var r=t.parentNode,i=t.nextSibling;n.each(function(t){r.insertBefore(0===e?t:t.cloneNode(!0),i)})}),this},insertBefore:function(t){var n=this;return i(t).each(function(t,e){var r=t.parentNode;n.each(function(n){r.insertBefore(0===e?n:n.cloneNode(!0),t)})}),this},prepend:function(t){return N(this,t,!0),this},prependTo:function(t){return N(i(t),this,!0),this},remove:function(){return this.each(function(t){return t.parentNode.removeChild(t)})},text:function(t){return void 0===t?this[0].textContent:this.each(function(n){return n.textContent=t})}});var j=w.documentElement;return D.extend({position:function(){var t=this[0];return{left:t.offsetLeft,top:t.offsetTop}},offset:function(){var t=this[0].getBoundingClientRect();return{top:t.top+T.pageYOffset-j.clientTop,left:t.left+T.pageXOffset-j.clientLeft}},offsetParent:function(){return i(this[0].offsetParent)}}),D.extend({children:function(t){var n=[];return this.each(function(t){H.apply(n,t.children)}),n=s(n),t?n.filter(function(n){return u(n,t)}):n},closest:function(t){return!t||u(this[0],t)?this:this.parent().closest(t)},is:function(t){if(!t)return!1;var n=!1,e=q(t)?u:t.cash?function(n){return t.is(n)}:b;return this.each(function(r,i){return n=e(r,t,i),!n}),n},find:function(n){if(!n)return i();var e=[];return this.each(function(r){H.apply(e,t(n,r))}),s(e)},has:function(t){return B.call(this,function(n){return 0!==i(n).find(t).length})},next:function(){return i(this[0].nextElementSibling)},not:function(t){return B.call(this,function(n){return!u(n,t)})},parent:function(){var t=this.map(function(t){return t.parentElement||w.body.parentNode});return s(t)},parents:function(t){var n,e=[];return this.each(function(r){for(n=r;n!==w.body.parentNode;)n=n.parentElement,(!t||t&&u(n,t))&&e.push(n)}),s(e)},prev:function(){return i(this[0].previousElementSibling)},siblings:function(){var t=this.parent().children(),n=this[0];return B.call(t,function(t){return t!==n})}}),i});