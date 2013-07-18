/*
 * underscore.dom
 * http://uhpnou.github.io/underscore.dom
 *
 * (c) 2013 Giuseppe Sorrentino <uhpnou aet gmail dot com>
 * underscore.dom is freely distributable under the terms of the MIT license.
 *
 * Some code is borrowed from:
 * - underscore.string - http://epeli.github.io/underscore.string/
 * - addy osmany pub/sub design pattern - http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript
 * - matchesSelector polyfill - https://gist.github.com/jonathantneal/3062955
 * - gator - http://craig.is/riding/gators
 *
 * Version '0.1.0'
 *
 * Desktop Support: IE8+, FF 20+, Chrome 26+, Safari 5+, Opera 12+
 * IE8 is supported only with CSS2 Selectors
 *
 * Mobile Support: IOs Safari 3.2+, Andorid Browser 2.1+, BB 7+, Opera Mini 5+
 *
 */

!function(root) {
  'use strict';

  /**
   * [hasClassList description]
   * @type {Boolean}
   */
  var hasClassList = (typeof root.Element === 'undefined' ||
      'classList' in root.document.documentElement);

  /**
   * [hasGetComputedStyle description]
   * @type {Boolean}
   */
  var hasGetComputedStyle = (root.getComputedStyle);

  /**
   * [hasAddEventListener description]
   * @type {Boolean}
   */
  var hasAddEventListener = (window.addEventListener);

  // Checking the exsistence of Element.matches and its vendor specific
  // alternatives
  /**
   * [hasMatchesSelector description]
   * @type {Boolean}
   */
  var hasMatchesSelector = Element.prototype.matches ||
      Element.prototype.matchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector;

  if (hasMatchesSelector) var whichMatchesSelector = hasMatchesSelector.name;

  // Simple function which checks a if an element has class or not
  // Uses Element.classList.contains if available
  /**
   * [_hasClass description]
   * @param  {[type]}  object [description]
   * @param  {[type]}  string [description]
   * @return {Boolean}        [description]
   */
  function _hasClass(object, string) {
    if (hasClassList) {
      return object.classList.contains(string);
    } else {
      var array = object.className.split(' '), i = 0;
      while (i < array.length) {
        if (array[i] === string) return true;
        i++;
      }
      return false;
    }
  }

  // Simple function which adds a class to an element
  // Uses Element.classList.add if available
  function _addClass(object, string) {
    var classes = string.split(' ');
    if (hasClassList) {
      if (classes.length > 1)
        object.classList.add.apply(object.classList, classes);
      else object.classList.add(string);
    } else {
      if (classes.length > 1) {
        var i = classes.length;
        while (i--) {
          if (!_hasClass(object, string)) object.className += ' ' + string;
        }
      } else {
        if (!_hasClass(object, string)) object.className += ' ' + string;
      }
    }
    return object;
  }

  // Simple function which removes a class to an element
  // Uses Element.classList.remove if available
  function _removeClass(object, string) {
    var classes = string.split(' ');
    if (hasClassList) {
      if (classes.length > 1)
        object.classList.remove.apply(object.classList, classes);
      else object.classList.remove(string);
    } else {
      if (classes.length > 1) {
        var array = object.className.split(' '),
            i = classes.length,
            j = array.length;
        while (i--) {
          while (j--) {
            if (array[j] == classes[i]) array.splice(j, 1);
          }
        }
      } else {
        var array = object.className.split(' '), i = array.length;
        while (i--) {
          if (array[i] == string) array.splice(i, 1);
        }
        object.className = array.join(' ');
      }
    }
    return object;
  }

  // Simple function which toggles a class to an element
  // Uses Element.classList.toggle if available
  function _toggleClass(object, string, state) {
    if (hasClassList) {
      if (!state) object.classList.toggle(string);
      if (state === true) object.classList.add(string);
      if (state === false) object.classList.remove(string);
    } else {
      if (!state) {
        if (_hasClass(object, string)) {
          _removeClass(object, string);
        } else {
          _addClass(object, string);
        }
      }
      if (state === true) _addClass(object, string);
      if (state === false) _removeClass(object, string);
    }
  }

  function _toggleClassesHelper(object, string, state) {
    var classes = string.split(' ');
    if (classes.length > 1) {
      var i = classes.length;
      while (i--) {
        _toggleClass(object, classes[i], state);
      }
    } else {
      _toggleClass(object, string, state);
    }
    return object;
  }

  // Function to manage element style. It can be used in four ways:
  // 1) READING SINGLE PROPERTY _css(object, 'width')
  // 2) SETTING SINGLE PROPERTY _css(object, 'width', '200px')
  // 3) READING MULTIPLE PROPERTIES _css(object, ['width', 'paddingLeft'])
  // 4) SETTING MULTIPLE PROPERTIES _css(object,
  // {'width':'200px', 'paddingLeft':'50px'})
  function _css(object, extension, value) {
    if (typeof extension === 'string' && !value) {
      if (hasGetComputedStyle) {
        var c_s = getComputedStyle(object);
      } else {
        var c_s = object.currentStyle;
      }
      return c_s[extension];
    }
    if (typeof extension === 'string' && value) {
      object.style[extension] = value;
      return object;
    }
    if (extension instanceof Array) {
      if (hasGetComputedStyle) {
        var c_s = getComputedStyle(object);
        return _.pick(c_s, extension);
      } else {
        return _.pick(object.currentStyle, extension);
      }
    }
    if (extension instanceof Object) {
      _.extend(object.style, extension);
      return object;
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
        if (nodeList[i] == object) return true;
        i++;
      }
      return false;
    }
  }

  // Simple function which selects object childnodes through a selector
  // Based on QSA
  function _find(object, selector) {
    var result = object.querySelectorAll(selector);
    if (result.length == 1) return result[0];
    return result;
  }

  // Simple function which gets the parentNode
  function _parent(object) {
    return object.parentNode;
  }

  // Simple function to get the current coordinates relative to the parent.
  function _position(object) {
    if (object.offsetTop && object.offsetLeft) {
      var o_t = object.offsetTop, o_l = object.offsetLeft;
      return {top: o_t, left: o_l};
    }
  }

  // Function to read or set the object offset. Can be used in two ways:
  // 1) READING THE OFFSET _offset(object)
  // 2) SET THE OFFSET _offset(object, {top: 200, left: 200})
  function _offset(object, value) {
    if (typeof value === 'object') {
      if (typeof value.top === 'number') value.top += 'px';
      if (typeof value.left === 'number') value.left += 'px';
      _css(object, {
        'position': 'absolute',
        'top': value.top,
        'left': value.left
      });
      return object;
    } else {
      var o_l = 0, o_t = 0;
      if (object.getBoundingClientRect) {
        var result = object.getBoundingClientRect();
        o_l += result.left;
        o_t += result.top;
        return {top: o_t, left: o_l};
      }
    }
  }

  // Function to read or set the object inner width. Can be used in two ways:
  // 1) READING THE WIDTH _width(object)
  // 2) SET THE WIDTH _width(object, 200)
  function _width(object, value) {
    if (!value) {
      if (object.innerWidth) return object.innerWidth;
      if (object.clientWidth) return object.clientWidth;
      if (object.offsetWidth) return object.offsetWidth;
    } else {
      if (typeof value === 'number') value += 'px';
      _css(object, 'width', value);
      return object;
    }
  }

  // Function to read or set the object inner height. Can be used in two ways:
  // 1) READING THE HEIGHT _heigth(object)
  // 2) SET THE HEIGHT _height(object, 200)
  function _height(object, value) {
    if (!value) {
      if (object.innerHeight) return object.innerHeight;
      if (object.clientHeight) return object.clientHeight;
      if (object.offsetHeight) return object.offsetHeight;
    } else {
      if (typeof value === 'number') value += 'px';
      _css(object, 'height', value);
      return object;
    }
  }

  // Utility function to use native methods on objects
  function _vanilla(object, method) {
    var namespaces = method.split('.');
    var fMethod = method;
    var fObject = object;
    if (namespaces.length > 1) {
      fMethod = namespaces.pop();
      var i = namespaces.length;
      while (i--) {
        fObject = fObject[namespaces[i]];
      }
    }
    if (typeof fObject[fMethod] === 'function') {
      var args = [];
      [].push.apply(args, arguments);
      [].splice.call(args, 0, 2);
      var r = fObject[fMethod].apply(fObject, args);
      if (r) return r;
      return object;
    }
    if ((typeof fObject[fMethod] === 'number' ||
      typeof fObject[fMethod] === 'string') && arguments.length === 3) {
      fObject[fMethod] = arguments[2];
      return object;
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

  // Prevents events default behaviours
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
      if (eventType == 'focus') eventType = 'focusin';
      if (eventType == 'blur') eventType = 'focusout';
      object.attachEvent('on' + eventType, callback);
    }
  }

  // Removes events from objects
  // Uses removeEventListener if available
  function _removeEvent(object, eventType, callback) {
    if (hasAddEventListener) {
      object.removeEventListener(eventType, callback, false);
    } else {
      if (eventType == 'focus') eventType = 'focusin';
      if (eventType == 'blur') eventType = 'focusout';
      object.detachEvent('on' + eventType, callback);
    }
  }

  // Manages event attachment and event delegation
  // Returns an handle to which can be used with _off
  function _on(object, eventType, selector, callback) {
    var handle;
    if (typeof object === 'object' && !eventType && !selector && !callback) {
      object.object.addEventListener(object.eventType, object.callback, false);
    }
    if (typeof selector === 'function') {
      _addEvent(object, eventType, selector, false);
      handle = {
        object: object,
        eventType: eventType,
        callback: callback
      };
      return handle;
    }
    if (typeof selector === 'string') {
      var delegate = _.wrap(callback, function(callback, e) {
        if (e.target && _is(e.target, selector)) {
          callback(e);
        }
      });
      _addEvent(object, eventType, delegate, false);
      handle = {
        object: object,
        eventType: eventType,
        selector: selector,
        callback: delegate
      };
      return handle;
    }
  }

  // Removes event attachment and event delegation created with _on
  function _off(object, eventType, callback) {
    if (typeof object === 'object' && !eventType && !callback) {
      _removeEvent(object.object, object.eventType, object.callback);
    } else {
      _removeEvent(object, eventType, callback);
    }
  }

/*  function _classesHelper(func) {
    var classesHelper = _.wrap(func, function(func) {
      var object = arguments[1];
      var string = arguments[2];
      var state = arguments[3];
      var array = string.split(' ');
      if (array.length > 1) {
        var i = array.length;
        while (i--) {
          var result = func(object, array[i], state);
        }
      } else {
        var result = func(object, string, state);
      }
      return result;
    });
    classesHelper.id = func.name;
    return classesHelper;
  }*/

  function _opFuncHelper(operation, i, args) {
    var object = args[0];
    switch (operation) {
      case '_addClass':
      case '_removeClass':
        var parameter = object.className;
        args[1] = args[1](i, parameter);
        return args;
      case '_toggleClass':
        var parameter = object.className;
        if (args[2]) args[1] = args[1](i, parameter, args[2]);
        if (args[2] === undefined) args[1] = args[1](i, parameter);
        return args;
      case '_offset':
        var parameter = _offset(object);
        args[1] = args[1](i, parameter);
        return args;
      case '_width':
        var parameter = _width(object);
        args[1] = args[1](i, parameter);
        return args;
      case '_height':
        var parameter = _height(object);
        args[1] = args[1](i, parameter);
        return args;
      case '_css':
        var parameter = _css(object, args[1]);
        args[2] = args[2](i, parameter);
        return args;
    }
  }

  // Helper function to allow management of nodeLists
  function _nodeListHelper(func) {
    return _.wrap(func, function(func) {
      var object = arguments[1];
      if (object.length) {
        var results = [], i = 0;

        if (((func.name === '_height' ||
            func.name === '_wnameth' ||
            func.name === '_position' ||
            func.name === '_offset') && arguments.length === 2) ||
            (func.name === '_css' && arguments.length === 3)) {
          var args = [];
          [].push.apply(args, arguments);
          [].splice.call(args, 0, 2);
          [].unshift.call(args, object[i]);
          return func.apply(func, args);
        }

        while (i < object.length) {
          var args = [];
          [].push.apply(args, arguments);
          [].splice.call(args, 0, 2);
          [].unshift.call(args, object[i]);

          if (((func.name === '_addClass' ||
              func.name === '_removeClass' ||
              func.name === '_toggleClass' ||
              func.name === '_offset' ||
              func.name === '_wnameth' ||
              func.name === '_height') && typeof args[1] === 'function') ||
              (func.name === '_css' && typeof args[2] === 'function')) {
            args = _opFuncHelper(func.id, i, args);
          }

          var result = func.apply(func, args);

          if (result.length) {
            results.push.apply(results, result);
          } else {
            results.push(result);
          }
          i++;
        }

        return results;
      } else {
        var args = [];
        [].push.apply(args, arguments);
        [].splice.call(args, 0, 1);
        return func.apply(func, args);
      }
    });
  }

  function _nodeListEq(object, index) {
    return object[index];
  }

  // The underscore.dom publish/subscribe module
  // Returns an object with the publish/subscribe/unsubscribe methods
  function _Publisher(object) {
    var topics = {};
    if (!object) object = {};

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
        return this;
      },

      // Subscribes a function to a channel
      // Returns an handle to be used with unsubscribe and subscribe
      subscribe: function(topic, func) {
        if (typeof topic === 'object' && !func) {
          topics[topic.topic].push(topic);
          return topic;
        }
        if (typeof topic === 'string' && func) {
          if (!topics[topic]) {
            topics[topic] = [];
          }
          var id = _.uniqueId(),
              handle = {
                topic: topic,
                id: id,
                func: func
              };
          topics[topic].push(handle);
          return handle;
        }
        return this;
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
        return this;
      }
    };

    // Extends the object returned from Publisher with the PubSub methods
    _.extend(object, PubSub);
    return object;
  }

  // The default selector engine
  // It is based on document.getElementById and QSA
  function _selectorEngine(s, c) {
    if (c) var context = c.match(/^#\w+$/);
    if (context) return document.getElementById(c.slice(1)).querySelectorAll(s);
    var byId = s.match(/^#\w+$/);
    if (byId) return document.getElementById(s.slice(1));
    var result = document.querySelectorAll(s);
    if (result.length == 1) return result[0];
    return result;
  }

  // The _.dom function. It uses _selectorEngine as selector
  function _dom(s, c) {
    if (typeof s === 'string') {
      return _(_selectorEngine(s, c));
    } else {
      return _(s);
    }
  }

  //The _dom object - Underscore.js mixins only
  var _mixins = {
    hasClass: _nodeListHelper(_hasClass),
    addClass: _nodeListHelper(_addClass),
    removeClass: _nodeListHelper(_removeClass),
    toggleClass: _nodeListHelper(_toggleClassesHelper),
    css: _nodeListHelper(_css),
    is: _nodeListHelper(_is),
    find: _nodeListHelper(_find),
    parent: _nodeListHelper(_parent),
    position: _nodeListHelper(_position),
    offset: _nodeListHelper(_offset),
    width: _nodeListHelper(_width),
    height: _nodeListHelper(_height),
    vanilla: _nodeListHelper(_vanilla),
    on: _nodeListHelper(_on),
    off: _nodeListHelper(_off),
    eq: _nodeListEq
  };

  // Integrate _dom with Underscore.js
  _.mixin(_mixins);

  // Extending the _dom object with non Underscore.js mixins
  _dom.tools = {
    Publisher: _Publisher,
    stopPropagation: _stopPropagation,
    preventDefault: _preventDefault
  };

  // Define a CommonJS module
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) module.exports = _dom;
    exports._dom = _dom;
  }

  // Register as a named module with AMD.
  if (typeof define === 'function' && define.amd)
    define('underscore.dom', ['underscore-amd'], function() { return _dom; });

  // Exporting the dom object
  root._dom = _dom;

}(this);
//# sourceMappingURL=underscore.dom-min.map
