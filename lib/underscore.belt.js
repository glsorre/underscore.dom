//  underscore.belt
//	http://uhpnou.github.io/underscore.string
//	
//  (c) 2013 Giuseppe Sorrentino <uhpnou aet gmail dot com>
//  Underscore.belt is freely distributable under the terms of the MIT license.
//
//  Some code is borrowed from:
//		* underscore.string - http://epeli.github.io/underscore.string/
//		* addy osmany pub/sub design pattern - http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript
//		* matchesSelector polyfill - https://gist.github.com/jonathantneal/3062955
//		* gator - http://craig.is/riding/gators
//
//  Version '0.0.2'
//	Target Desktop Support: IE8+, FF 20+, Chrome 26+, Safari 5+, Opera 12+
//	IE8 is supported only for CSS2 Selectors
//
//	Target Mobile Support: IOs Safari 3.2+, Andorid Browser 2.1+,
//						   BB 7+, Opera Mini 5+

!function(root){
	'use strict';

	// Checking the exsistence of Element.ClassList
	var hasClassList = (typeof root.Element === "undefined" ||
		"classList" in root.document.documentElement);

	// Checking the exsistence of getComputedStyle
	var hasGetComputedStyle = (root.getComputedStyle);

	// Checking the exsistence of addEventListener
	var hasAddEventListener = (window.addEventListener);

	// Checking the exsistence of Element.matches and its vendor specific
	// alternatives
	var hasMatchesSelector = Element.prototype.matches ||
		Element.prototype.matchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector;

	if (hasMatchesSelector) var whichMatchesSelector = hasMatchesSelector.name;

	// Simple function which checks a if an element has class or not
	// Uses Element.classList.contains if available
	function _hasClass(object, string) {
		if (hasClassList) {
			return object.classList.contains(string);
		} else {
			var array = object.className.split(" "),
				i = 0;
			while (i < array.length) {
				if (array[i] === string) return true;
				i++;
			}
			return false
		}
	}

	// Simple function which adds a class to an element
	// Uses Element.classList.add if available
	function _addClass(object, string) {
		if (hasClassList) {
			object.classList.add(string);
		} else {
			if (!_hasClass(object, string)) object.className += " " + string;
		}
		
	  return object
	}

	// Simple function which removes a class to an element
	// Uses Element.classList.remove if available
	function _removeClass(object, string) {
		if (hasClassList) {
			object.classList.remove(string);
		} else {
			var array = object.className.split(" "),
				i = array.length;
			while (i--) {
				if (array[i] == string) array.splice(i, 1); 
			}
			object.className = array.join(" ");
		}
		
	  return object
	}

	// Simple function which toggles a class to an element
	// Uses Element.classList.toggle if available
	function _toggleClass(object, string) {
		if (hasClassList) {
			object.classList.toggle(string);
		} else {
			if (_hasClass(object, string)) {
				_removeClass(object,string);
			} else {
				object.className += " " + string;
			}
		}
		
	  return object
	}

	// Function to manage element style. It can be used in four ways:
	// 1) READING SINGLE PROPERTY _css(object, 'width')
	// 2) SETTING SINGLE PROPERTY _css(object, 'width', '200px')
	// 3) READING MULTIPLE PROPERTIES _css(object, ['width', 'paddingLeft'])
	// 4) SETTING MULTIPLE PROPERTIES _css(object,
	// {'width':'200px', 'paddingLeft':'50px'})
	function _css(object, extension, value) {
		if (typeof extension === "string" && !value) {
			var c_s = getComputedStyle(object);
			return c_s[extension];
		}
		if (typeof extension === "string" && value) {
			object.style[extension] = value;
			return object
		}
		if (extension instanceof Array) {
			if (hasGetComputedStyle) {
				var c_s = getComputedStyle(object);
				return _.pick(c_s, extension)
			} else {
				return _.pick(object.currentStyle, extension)
			}			
		} 
		if (extension instanceof Object) {
			_.extend(object.style, extension)
			return object
		}
	}

	// Simple function which check if an element matches a selector
	// Uses Element.matchesSelector if available
	function _is(object, selector) {
		if (hasMatchesSelector) {
			return object[whichMatchesSelector](selector);
		} else {
			var nodeList = object.parentNode.querySelectorAll(selector),
		  	length = nodeList.length,
		  	i = 0;
			while (i < length) {
				if (nodeList[i] == object) return true
				++i;
			}
			return false
		}
	}

	// Simple function which selects object childnodes through a selector
	// Based on QSA
	function _find(object, selector) {
		var result = object.querySelectorAll(selector);
		if (result.length == 1) return result[0];
		return result
	}

	// Simple function which get the parentNode
	function _parent(object) {
		return object.parentNode;
	}

	// Simple function to get the current coordinates relative to the offset
	// parent.
	function _position(object) {
		if (object.offsetTop && object.offsetLeft) {
			var o_t = object.offsetTop,
				o_l = object.offsetLeft;

			return {top: o_t, left: o_l}
		}
	}

	// Function to read or set the object offset. Can be used in two ways:
	// 1) READING THE OFFSET _offset(object)
	// 2) SET THE OFFSET _offset(object, {top: 200, left: 200})
	function _offset(object, value) {
		if (typeof value === "object") {
			if (typeof value.top === "number") value.top += "px";
			if (typeof value.left === "number") value.left += "px";
			_css(object, {
				'position': 'absolute',
				'top': value.top,
				'left': value.left
			});
			return object
		} else {
			var o_l = 0, 
				o_t = 0;

			if (object.getBoundingClientRect) {
				var result = object.getBoundingClientRect();
				o_l += result.left;
				o_t += result.top;
				return {top: o_t, left: o_l}
			}
		}
	}

	// Function to read or set the object inner width. Can be used in two ways:
	// 1) READING THE WIDTH _width(object)
	// 2) SET THE WIDTH _width(object, 200)
	function _width(object, value) {
		if (!value) {
			if (object.innerWidth) return object.innerWidth;
			if (object.clientHeight) return object.clientHeight;
		} else {
			if (typeof value === "number") value += "px";
			_css(object, 'width', value);
			return object
		}
	}

	// Function to read or set the object inner height. Can be used in two ways:
	// 1) READING THE HEIGHT _heigth(object)
	// 2) SET THE HEIGHT _height(object, 200)
	function _height(object, value) {
		if (!value) {
			if (object.innerHeight) return object.innerHeight;
			if (object.clientHeight) return object.clientHeight;
		} else {
			if (typeof value === "number") value += "px";
			_css(object, 'height', value);
			return object
		}
	}

	// Utility function to use native methods on objects
	function _native(object, method) {
		var namespaces = method.split('.')
		var fMethod = method;
		var fObject = object;
		if (namespaces.length > 1) {
			var fMethod = namespaces.pop();
			var i = namespaces.length;
			while (i--) {
				fObject = fObject[namespaces[i]];
			}
		}
		if (typeof fObject[fMethod] === "function") {
			var args = [];
			[].push.apply(args, arguments);
			[].splice.call(args, 0, 2);
			var r = fObject[fMethod].apply(fObject, args)
			if (r) return r
			return object
		}
		if ((typeof fObject[fMethod] === "number"
			|| typeof fObject[fMethod] === "string")
			&& arguments.length === 3) {
			fObject[fMethod] = arguments[2];
			return object
		}
		if (fObject[fMethod]) {
			return fObject[fMethod];
		}
	}

	// Stops events propagation
	function _stopPropagation(e) {
		if (e.stopPropagation) e.stopPropagation();
		e.cancelBubble = true;
	}

	// Prevents events default behavours
	function _preventDefault(e) {
		if (e.preventDefault) e.preventDefault();
		e.returnValue = false;
	}

	// Attachs events to objects
	// Uses addEventListener if available
	function _addEvent(object, eventType, callback) {
		if (hasAddEventListener) {
			object.addEventListener(eventType, callback, false);
		} else {
			if (eventType == 'focus') eventType = "focusin"; 
			if (eventType == 'blur') eventType = "focusout";
			object.attachEvent('on' + eventType, callback);
		}
	}

	// Removes events from objects
	// Uses removeEventListener if available
	function _removeEvent(object, eventType, callback) {
		if (hasAddEventListener) {
			object.removeEventListener(eventType, callback, false);
		} else {
			if (eventType == 'focus') eventType = "focusin"; 
			if (eventType == 'blur') eventType = "focusout";
			object.detachEvent('on' + eventType, callback);
		}
	}

	// Manages event attachment and event delegation
	// Returns an handle to which can be used with _off
	function _on(object, eventType, selector, callback) {
		if (typeof object === "object"
			&& !eventType
			&& !selector
			&& !callback) {
			object.object.addEventListener(object.eventType,
				object.callback,
				false);
		}

		if (typeof selector === "function") {
			_addEvent(object, eventType, selector, false);

			var handle = {
				object: object,
				eventType: eventType,
				callback: callback
			}

			return handle
		}

		if (typeof selector === "string" ) {
			var delegate = _.wrap(callback, function(callback, e){
				if (e.target && _is(e.target, selector)) {
					callback(e);
				}
			});

			_addEvent(object, eventType, delegate, false);

			var handle = {
				object: object,
				eventType: eventType,
				selector: selector,
				callback: delegate
			}

			return handle
		}
	}

	// Removes event attachment and event delegation created with _on
	function _off(object, eventType, callback) {
		if (typeof object === "object" && !eventType && !callback) {
			_removeEvent(object.object, object.eventType, object.callback);
		} else {
			_removeEvent(object, eventType, callback);
		}
	}

	// Helper function to allow management of nodeLists 
	function _nodeListHelper(func) {
		return _.wrap(func, function(func){
			var object = arguments[1];

			if (object.length) {
				var results = [];
				var i = 0;

				while (i < object.length) {
					var args = [];
					[].push.apply(args, arguments);
					[].splice.call(args, 0, 2);
					[].unshift.call(args, object[i]);
					var result = func.apply(func, args);
					results.push(result);
					i++;
				}

				return results
			} else {
				var args = [];
				[].push.apply(args, arguments);
				[].splice.call(args, 0, 1);
				return func.apply(func, args);
			}
		});
	}

	// The underscore.belt publish/subscribe module
	// Returns an object with the publish/subscribe/unsubscribe methods
	var _Publisher = function(object) {
		var topics = {};
		if (!object) var object = {};

		var PubSub = {
			// Publishes channels
			publish: function(topic, args) {
				if (!topics[topic]) {
					return false;
				}

				var subscribers = topics[topic],
					len = subscribers.length;

				while (len--) {
					subscribers[len].func(topic, args);
				}

				return this
			},

			// Subscribes a function to a channel
			// Returns an handle to be used with unsubscribe and subscribe
			subscribe: function(topic, func) {
				if (typeof topic === "object" && !func) {
					topics[topic.topic].push(topic);
					return topic
				}

				if (typeof topic === "string" && func) {
					if (!topics[topic]) {
						topics[topic] = [];
					}

					var id = _.uniqueId(),
						handle = {
							topic: topic,
							id: id,
							func: func
						}

					topics[topic].push(handle);

					return handle
				}

				return this
			},

			// Unsubscribes a function from a channel
			// Accepts an handle returned from subscribe
			unsubscribe: function(handle) {
				if (topics[handle.topic]) {

					for (var i = 0; i < topics[handle.topic].length; i++) {

						if (topics[handle.topic][i].id === handle.id) {
							topics[handle.topic].splice(i, 1);
							return handle;
						}
					}
				}
				return this
			}

		}

		// Extends the object returned from Publisher with the PubSub methods
		_.extend(object, PubSub)
		return object;
	}

	// The default selector engine
	// It is based on document.getElementById and QSA
	function _selectorEngine(s) {
		var byId = s.match(/^#\w+$/);
		if (byId) return document.getElementById(s.slice(1));
		var result = document.querySelectorAll(s);
		if (result.length == 1) return result[0];
		return result
	}

	// The _.belt function. It uses _config.defaulEngine as selector
	function _belt(s, c) {
		if (typeof s === 'string') {
			return _(_selectorEngine(s));
		} else {
			return _(s);
		}
	}

	//The _belt object - Underscore.js mixins only
	var _belt = {
		hasClass: _nodeListHelper(_hasClass),
		addClass: _nodeListHelper(_addClass),
		removeClass: _nodeListHelper(_removeClass),
		toggleClass: _nodeListHelper(_toggleClass),
		css: _nodeListHelper(_css),
		is: _nodeListHelper(_is),
		find: _nodeListHelper(_find),
		parent: _nodeListHelper(_parent),
		position: _nodeListHelper(_position),
		offset: _nodeListHelper(_offset),
		width: _nodeListHelper(_width),
		height: _nodeListHelper(_height),
		native: _nodeListHelper(_native),
		on: _nodeListHelper(_on),
		off: _nodeListHelper(_off),
		belt: _belt
	}

	// Integrate _belt with Underscore.js
	_.mixin(_belt);

	// Extending the _belt object with non Underscore.js mixins
	_belt.tools = {
		Publisher: _Publisher,
		stopPropagation: _stopPropagation,
		preventDefault: _preventDefault
	}

	// CommonJS module is defined
	if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) module.exports = belt;

	exports.belt = belt;
	}

	// Register as a named module with AMD.
	if (typeof define === 'function' && define.amd)
		define('underscore.belt', ['underscore-amd'],
			function(){ return belt; });

	// Exporting the belt object
	root.belt = _belt;

}(this);