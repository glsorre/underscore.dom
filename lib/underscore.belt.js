//  Underscore.belt
//  (c) 2013 Giuseppe Sorrentino <uhpnou aet gmail dot com>
//  Underscore.belt is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/uhpnou/underscore.belt
//
//  Some code is borrowed from:
//		* underscore.string - http://epeli.github.io/underscore.string/
//
//		* addy osmany pub/sub design pattern
//		- http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript
//
//		* matchesSelector polyfill - https://gist.github.com/jonathantneal/3062955
//
//		* gator - http://craig.is/riding/gators
//
//  Version '0.0.2'
//	Target Desktop Support: IE8+, FF 20+, Chrome 26+, Safari 5+, Opera 12+
//	Target Mobile Support: IOs Safari 3.2+, Andorind Borwser 2.1+, BB 7+, Opera Mini 5+

!function(root){
	'use strict';

	var hasClassList = (typeof root.Element === "undefined" ||
		"classList" in root.document.documentElement);

	var hasGetComputedStyle = (root.getComputedStyle);

	var hasAddEventListener = (window.addEventListener);

	var hasMatchesSelector = Element.prototype.matches ||
		Element.prototype.matchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector;

	if (hasMatchesSelector) var whichMatchesSelector = hasMatchesSelector.name;

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

	function _addClass(object, string) {
		if (hasClassList) {
			object.classList.add(string);
		} else {
			if (!_hasClass(object, string)) object.className += " " + string;
		}
		
	  return object
	}

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

	function _css(object, extension) {
		if (extension instanceof Array) {
			if (hasGetComputedStyle) {
				var c_s = getComputedStyle(object);
				return _.pick(c_s, extension)
			} else {
				return _.pick(object.currentStyle, extension)
			}			
		} else if (extension instanceof Object) {
			return _.extend(object.style, extension)
		}
	}

	/*function _offset(object) {
		var o_t = object.offsetTop,
			o_l = object.offsetLeft;

		return {top: o_t, left: o_l}
	}*/

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

	function _stopPropagation(e) {
		if (e.stopPropagation) e.stopPropagation();
		e.cancelBubble = true;
	}

	function _preventDefault(e) {
		if (e.preventDefault) e.preventDefault();
		e.returnValue = false;
	}

	function _addEvent(object, eventType, callback) {
		if (hasAddEventListener) {
			object.addEventListener(eventType, callback, false);
		} else {
			if (eventType == 'focus') eventType = "focusin"; 
			if (eventType == 'blur') eventType = "focusout";
			object.attachEvent('on' + eventType, callback);
		}
	}

	function _removeEvent(object, eventType, callback) {
		if (hasAddEventListener) {
			object.removeEventListener(eventType, callback, false);
		} else {
			if (eventType == 'focus') eventType = "focusin"; 
			if (eventType == 'blur') eventType = "focusout";
			object.detachEvent('on' + eventType, callback);
		}
	}

	function _on(object, eventType, selector, callback) {
		if (typeof object === "object" && !eventType && !selector && !callback) {
			object.object.addEventListener(object.eventType, object.callback, false);
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

	function _off(object, eventType, callback) {
		if (typeof object === "object" && !eventType && !callback) {
			_removeEvent(object.object, object.eventType, object.callback);
		} else {
			_removeEvent(object, eventType, callback);
		}
	}

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

	var _Publisher = function(object) {
		var topics = {};
		if (!object) var object = {};

		var PubSub = {
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
		_.extend(object, PubSub)
		return object;
	}

	var _config = {
		defineEngine: function(s) {
			if (this.useLiveNodeList) {
				var fast = s.match(/^(#|\.|=|@)\w+$/);
				if (fast) {
					var c = {
						'#': 'ById',
						'.': 'sByClassName',
						'@': 'sByName',
						'=': 'sByTagName'
					}[s[0]];
					return document[c?'getElement'+c:'querySelectorAll'](s.slice(1));
				}
			} else {
				var byId = s.match(/^#\w+$/);
				return document[byId?'getElementById':'querySelectorAll'](s.slice(1));
			}
		},
		useLiveNodeList: true
	}

	function _belt(s, c) {
		if (typeof s === 'string') {
			return _(_config.defineEngine(s, c));
		} else {
			return _(s);
		}
	}

	//_belt objcet
	var _belt = {
		hasClass: _nodeListHelper(_hasClass),
		addClass: _nodeListHelper(_addClass),
		removeClass: _nodeListHelper(_removeClass),
		toggleClass: _nodeListHelper(_toggleClass),
		css: _nodeListHelper(_css),
		//offset: _nodeListHelper(_offset),
		is: _nodeListHelper(_is),
		on: _nodeListHelper(_on),
		off: _nodeListHelper(_off),
		belt: _belt
	}

	// Integrate with Underscore.js
  _.mixin(_belt);

	_belt.tools = {
		Publisher: _Publisher,
		stopPropagation: _stopPropagation,
		preventDefault: _preventDefault
	}

	_belt.config = function(o) {
		if (o) {
			_.extend(_config, o);
			return _config
		} else {
			return _config
		}
	}

	// CommonJS module is defined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = belt;

    exports.belt = belt;
  }

  // Register as a named module with AMD.
  if (typeof define === 'function' && define.amd)
    define('underscore.belt', ['underscore-amd'], function(){ return belt; });

  // Export
  root.belt = _belt;

}(this);