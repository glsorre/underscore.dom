/* TO TEST

on: _nodeListHelper(_on),
off: _nodeListHelper(_off),
stopPropagation: _stopPropagation,
preventDefault: _preventDefault

_nodeListHelper
Publisher: _Publisher,
*/

module("DOM Selection and Trasversing");

test("DOM Selection", function(assert) {
	var box = _.dom('#box')._wrapped;
	var boxes = _.dom('.boxes')._wrapped;
	var primo = _.dom('.boxes:first-child')._wrapped;

	assert.equal(box, document.getElementById('box'), "#id selcted");
	assert.deepEqual(boxes, document.querySelectorAll('.boxes'), ".class selected");
	assert.deepEqual(primo, document.querySelectorAll('.boxes:first-child')[0], ":first-child selected");
});

test("find(), parent(), is() methods", function(assert) {
	var box = _.dom('.primo').parent();
	var boxes = _.dom('#box').find('.boxes');
	var is = _.dom('.primo').is('.boxes:first-child')

	assert.equal(box, document.getElementById('box'), "parent() worked");
	assert.deepEqual(boxes, document.querySelectorAll('.boxes'), "find() worked");
	assert.equal(is, true, "is() worked");
});

module("DOM Manipulation");

test("Element Class Manipulation", function(assert) {
	assert.equal(_.dom('#box').hasClass("prima"), true, "has class prima");

	assert.equal(_.dom('#box').hasClass("none"), false, "has not class none");

	_.dom('#box').addClass("quarta");
	assert.equal(document.getElementById('box').className, "prima seconda terza quarta", "added class quarta");

	_.dom('#box').addClass("quarta");
	assert.equal(document.getElementById('box').className, "prima seconda terza quarta", "added class quarta");

	_.dom('#box').removeClass("quarta");
	assert.equal(document.getElementById('box').className, "prima seconda terza", "removed class quarta");

	_.dom('#box').toggleClass("terza");
	assert.equal(document.getElementById('box').className, "prima seconda", "removed class terza by toggle");

	_.dom('#box').toggleClass("terza");
	assert.equal(document.getElementById('box').className, "prima seconda terza", "added class terza using toggle");
});

test("CSS Manipulation", function(assert) {
	var el = document.getElementById('box');
	var css_get = {
  		"color": "rgb(0, 0, 0)",
  		"background-color": "rgb(255, 255, 255)"
	};
	var css_apply = {
		"color": "rgb(255, 255, 255)",
  		"backgroundColor": "rgb(255, 0, 0)"
	};

	assert.equal(_.dom('#box').css('width'), '100px', 'single computed style red');

	_.dom('#box').css('width', '200px');
	assert.equal('200px', el.style.width, 'single style modified');

	assert.deepEqual(_.dom('#box').css(['color', 'background-color']), css_get, 'multiple computed style red');
	
	_.dom('#box').css(css_apply)
	css_result = {
		"color": el.style.color,
		"backgroundColor": el.style.backgroundColor
	}
	assert.deepEqual(css_apply, css_result, 'mutiple style modified');
});

test("Elements Position and Dimensions", function(assert) {
	assert.equal(_.dom('.terzo').width(), 120, "width red correctly");
	assert.equal(_.dom('.terzo').height(), 120, "height red correctly");

	var el = document.querySelector('.terzo');
	_.dom('.terzo').width(140)
	assert.equal(160, el.clientWidth, "width red correctly");
	_.dom('.terzo').height(140)
	assert.equal(160, el.clientHeight, "height red correctly");

	position_get = {
		top: 110,
		left: 110
	}
	offset_get = {
		top: -9840,
		left: -9840
	}

	assert.deepEqual(_.dom('.terzo').position(), position_get, "position red correctly");

	assert.deepEqual(_.dom('.terzo').offset(), offset_get, "offset red correctly");

	offset_set = {
		top: 200,
		left: 200
	}
	offset_get = {
		top: -9740,
		left: -9740
	}
	_.dom('.terzo').offset(offset_set);
	assert.deepEqual(_.dom('.terzo').offset(), offset_get, "offset set correctly");
	
});

test("native method()", function(assert) {
	var el = document.querySelector('.primo');
	assert.equal(_.dom('.primo').native('clientHeight'), el.clientHeight, ".clientHeight called correclty");
	assert.deepEqual(_.dom('.primo').native('getBoundingClientRect'), el.getBoundingClientRect(), ".getBoundingClientRect called correclty");
	assert.equal(_.dom('#box').native('getAttribute', 'class'), "prima seconda terza", ".getAttribute('class') called correctly");
});

module("Internals");

test("_nodeListHelper()", function(assert) {
	var els = document.querySelectorAll('.boxes');
	var els_array = []
	els_array.push.apply(els_array, els);
	var anchors = document.querySelectorAll('.anchor');
	var anchors_array = []
	anchors_array.push.apply(anchors_array, anchors);

	height_get = [120, 120, 120];
	assert.deepEqual(_.dom(els).native('clientHeight'), height_get, "nodelist processed");
	assert.deepEqual(_.dom(els).native('clientHeight', '300'), els_array, "nodelist processed");
	assert.deepEqual(_.dom(els).chain().find('.anchor').native('clientHeight', '300').value(), anchors_array, "nodelist processed and flatted");
});