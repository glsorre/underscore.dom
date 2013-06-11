//  Underscore.belt
//  (c) 2013 Giuseppe Sorrentino <uhpnou aet gmail dot com>
//  Underscore.belt is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/uhpnou/underscore.belt
//  Some code is borrowed from:
//		* underscore.string
//		* addy osmany pub/sub design pattern
//		* 
//  Version '0.0.1'

!function(root){
	'use strict';

	var hasClassList = (typeof root.Element === "undefined" ||
		"classList" in root.document.documentElement);

	var hasGetComputedStyle = (root.getComputedStyle);

	var hasMatchesSelector = Element.prototype.matchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector;

	var whichMatchesSelector = hasMatchesSelector.name;

	var _belt = {

		hasClass: function(object, string) {
			if (hasClassList) {
				return object.classList.contains(string);
			} else {
				//REGEXP METHOD
				//var subst = new RegExp('(?:^|\\s)' + string + '(?!\\S)', 'g');
				//return object.className.match(subst) ? true : false;

				//ARRAY METHOD
				var array = object.className.split(" "),
					i = 0;
				while (i < array.length) {
					if (array[i] == string) return true;
					i++
				}
				return false;
			}
		},

		addClass: function(object, string) {
			if (hasClassList) {
				object.classList.add(string);
			} else {
				if (!this.hasClass(object, string)) object.className += " " + string;
			}
			
		  return object;
		},

		removeClass: function(object, string) {
			if (hasClassList) {
				object.classList.remove(string);
			} else {
				//REGEXP METHOD
				//var subst = new RegExp('(?:^|\\s)' + string + '(?!\\S)', 'g');
				//object.className = object.className.replace(subst, '');

				//ARRAY METHOD
				var array = object.className.split(" "),
					i = array.length;
				while (i--) {
					if (array[i] == string) array.splice(i, 1); 
				}
				object.className = array.join(" ");
			}
			
		  return object;
		},

		toggleClass: function(object, string) {
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
		},

		css: function(object, extension) {
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
		},

		offset: function(object) {
			var o_t = object.offsetTop, 
				o_l = object.offsetLeft;

			return {top: o_t, left: o_l};
		},

		is: function(object, selector) {
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
  	},

		on: function(events, selector, callback) {
			
		},

		off: function(events, selector, callback) {

		},

		PubSub: function() {

			var topics = {};

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
					if (typeof topic === "object") {
						topics[topic.topic].push(topic);
						return topic
					};

					if (typeof topic === "string") {
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

			return PubSub;
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
