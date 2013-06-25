/* TO TEST
belt: _belt

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

Publisher: _Publisher,
stopPropagation: _stopPropagation,
preventDefault: _preventDefault
*/

module("DOM Selection and Trasversing");

test("DOM Selection - useLiveNodeLists = false", function(assert) {
	var box = _.belt('#box')._wrapped;
	var boxes = _.belt('.boxes')._wrapped;

	assert.equal(box, document.getElementById('box'), "#id selcted");
	assert.deepEqual(boxes, document.querySelectorAll('.boxes'), ".class selected");
});

test("DOM Selection - liveNodeLists = true", function(assert) {
	belt.config({useLiveNodeList : true});

	assert.deepEqual(belt.config().useLiveNodeList, true , "belt.config.useLiveNodeList = true");

	var box = _.belt('#box')._wrapped;
	var boxes = _.belt('.boxes')._wrapped;

	assert.equal(box, document.getElementById('box'), "#id selcted");
	assert.deepEqual(boxes, document.getElementsByClassName('boxes'), ".class selected");
});

module("DOM Manipulation");

test("Element Class Manipulation", function(assert) {
	var el = document.getElementById('box');

	assert.equal(belt.hasClass(el, "test"), true, "el has class test");

	assert.equal(belt.hasClass(el, "none"), false, "el has not class none");

	belt.addClass(el, "teschio");
	assert.equal(el.className, "prova test acab teschio", "added class teschio");

	belt.addClass(el, "teschio");
	assert.equal(el.className, "prova test acab teschio", "not readded class teschio");

	belt.removeClass(el, "test");
	assert.equal(el.className, "prova acab teschio", "removed class test");

	belt.toggleClass(el, "teschio");
	assert.equal(el.className, "prova acab", "removed class teschio using toggle");

	belt.toggleClass(el, "teschio");
	assert.equal(el.className, "prova acab teschio", "added class teschio using toggle");
});

test("CSS Manipulation", function(assert) {
	var el = document.getElementById('box');
	var css_get = {
  	"color": "rgb(0, 0, 0)",
  	"background-color": "rgb(255, 255, 255)"
	};
	var css_apply = {
		"color": "#fff",
  	"backgroundColor": "#f00"
	};

	assert.deepEqual(belt.css(el, ['color', 'background-color']), css_get, "computed style red");
	assert.deepEqual(belt.css(el, css_apply), el.style, "computed style modified");
});


/*test("Reading Offset", function(assert) {
	var el = document.getElementById('box');

	assert.equal(belt.offset(el).top, 50, "offset top red");
	assert.equal(belt.offset(el).left, 50, "offset left modified");
});

module("Pub/Sub");
test("Publish/Subscribe Pattern", function(assert) {
	var pubsub = belt.tools.Publisher();

	var result = [];

	var comparison = [
		{
			topic: 'test',
			fruits: ['melon', 'orange']
		},
		{
			topic: 'test',
			fruits: ['melon', 'orange']
		}
	];

	function test(topic, args) {
		var s = {
			topic: topic,
			fruits: args
		}
		result.push(s);
	};

	var handle1 = pubsub.subscribe('test', test);
	var handle2 = pubsub.subscribe('test', test);

	pubsub.publish('test', ['melon', 'orange']);

	assert.deepEqual(result, comparison, 'two handle added, topic test pubblished');

	pubsub.unsubscribe(handle2);

	result = [];

	comparison = [
		{
			topic: 'test',
			fruits: ['melon', 'orange']
		}
	];

	pubsub.publish('test', ['melon', 'orange']);

	assert.deepEqual(result, comparison, 'handle unsubscribed');

	pubsub.subscribe(handle2);

	result = [];

	comparison = [
		{
			topic: 'test',
			fruits: ['melon', 'orange']
		},
		{
			topic: 'test',
			fruits: ['melon', 'orange']
		}
	];

	pubsub.publish('test', ['melon', 'orange']);

	assert.deepEqual(result, comparison, 'handle subscribed');

});*/