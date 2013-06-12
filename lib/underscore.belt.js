//  Underscore.belt
//  (c) 2013 Giuseppe Sorrentino <uhpnou aet gmail dot com>
//  Underscore.belt is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/uhpnou/underscore.belt
//
//  Some code is borrowed from:
//		* underscore.string - http://epeli.github.io/underscore.string/
//		* addy osmany pub/sub design pattern - http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript
//		* matchesSelector polyfill - https://gist.github.com/jonathantneal/3062955
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

	var whichMatchesSelector = hasMatchesSelector.name;

	function _hasClass(object, string) {
		if (hasClassList) {
			return object.classList.contains(string);
		} else {
			var array = object.className.split(" "),
				i = 0;
			while (i < array.length) {
				if (array[i] == string) return true;
				i++
			}
			return false;
		}
	};

	function _addClass(object, string) {
		if (hasClassList) {
			object.classList.add(string);
		} else {
			if (!this.hasClass(object, string)) object.className += " " + string;
		}
		
	  return object;
	};

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
		
	  return object;
	};

	function _toggleClass(object, string) {
		if (hasClassList) {
			object.classList.toggle(string);
		} else {
			if (this.hasClass(object, string)) {
				this.removeClass(object,string);
			} else {
				object.className += " " + string;
			}
		}
		
	  return object;
	};

	function _css(object, extension) {
		if (extension instanceof Array) {
			if (hasGetComputedStyle) {
				var c_s = getComputedStyle(object);
				return _.pick(c_s, extension);
			} else {
				return _.pick(object.currentStyle, extension);
			}			
		} else if (extension instanceof Object) {
			return _.extend(object.style, extension);
		}
	};

	function _offset(object) {
		var o_t = object.offsetTop, 
			o_l = object.offsetLeft;

		return {top: o_t, left: o_l};
	};

	function _is(object, selector) {
		if (hasMatchesSelector) {
			return object[whichMatchesSelector](selector);
		} else {
			var nodeList = object.parentNode.querySelectorAll(selector),
		  	length = nodeList.length,
		  	i = 0;
			while (i < length) {
				if (nodeList[i] == object) return true;
				++i;
			}
			return false;
		};
	};

	function _wrap(func) {
		return _.wrap(func, function(func, object, arg1, arg2, arg3){
			if (!_.isElement(object)) {
				return;
			}
			if (object.length) {
				var results = [];

				_.each(object, function(value, key, list) {
					console.log(value);
					var result = func(value, arg1, arg2, arg3);
					results.push(result);
				});

				return results
			} else {
				return func(object, arg1, arg2, arg3);
			};
		});
	};

	var _belt = {

		hasClass: _wrap(_hasClass),

		addClass: _wrap(_addClass),

		removeClass: _wrap(_removeClass),

		toggleClass: _wrap(_toggleClass),

		css: _wrap(_css),

		offset: _wrap(_offset),

		is: _wrap(_is),

		Publisher: function(object) {

			var topics = {};
			if (!object) var object = {};

			var PubSub = {

				publish: function(topic, args) {
					if (!topics[topic]) {
						return false;
					};

					var subscribers = topics[topic],
						len = subscribers.length;

					while (len--) {
						subscribers[len].func(topic, args);
					};

					return this;
				},

				subscribe: function(topic, func) {
					if (typeof topic === "object" && !func) {
						topics[topic.topic].push(topic);
						return topic
					};

					if (typeof topic === "string" && func) {
						if (!topics[topic]) {
							topics[topic] = [];
						};

						var id = _.uniqueId(),
							handle = {
								topic: topic,
								id: id,
								func: func
							};

						topics[topic].push(handle);

						return handle;
					};

					return this;
				},

				unsubscribe: function(handle) {
					if (topics[handle.topic]) {

						for (var i = 0; i < topics[handle.topic].length; i++) {

							if (topics[handle.topic][i].id === handle.id) {
								topics[handle.topic].splice(i, 1);
								return handle;
							};
						};
					};

					return this;
				}

			};

			_.extend(object, PubSub)

			return object;
		}

	};

	// CommonJS module is defined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = _belt;

    exports._belt = _belt;
  }

  // Register as a named module with AMD.
  if (typeof define === 'function' && define.amd)
    define('underscore.belt', [], function(){ return _belt; });

  // Export
  root._belt = _belt;

  // Integrate with Underscore.js
  //_.mixin(_belt);

}(this);
