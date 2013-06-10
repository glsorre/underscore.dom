module("DOM Manipulation");

test("Element Class Manipulation", function(assert) {
	var el = document.getElementById('box');

	assert.equal(_belt.hasClass(el, "test"), true, "el has class test");

	assert.equal(_belt.hasClass(el, "none"), false, "el has not class none");

	_belt.addClass(el, "teschio");
	assert.equal(el.className, "prova test acab teschio", "added class teschio");

	_belt.addClass(el, "teschio");
	assert.equal(el.className, "prova test acab teschio", "not readded class teschio");

	_belt.removeClass(el, "test");
	assert.equal(el.className, "prova acab teschio", "removed class test");

	_belt.toggleClass(el, "teschio");
	assert.equal(el.className, "prova acab", "removed class teschio using toggle");

	_belt.toggleClass(el, "teschio");
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

	assert.deepEqual(_belt.css(el, ['color', 'background-color']), css_get, "computed style red");
	assert.deepEqual(_belt.css(el, css_apply), el.style, "computed style modified");
});


test("Reading Offset", function(assert) {
	var el = document.getElementById('box');

	assert.equal(_belt.offset(el).top, 50, "computed style red");
	assert.equal(_belt.offset(el).left, 50, "computed style modified");
});

module("Pub/Sub");
test("Publish/Subscribe Pattern", function(assert) {
	var pubsub = _belt.PubSub();

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

});

module("IE8");
test("CSS Manipulation", function(assert) {
	var el = document.getElementById('box');
	var css_get_IE8 = {
	  "color": "#000000",
	  "background-color": "#fff"
	};

	assert.deepEqual(_belt.css(el, ['color', 'background-color']), css_get_IE8, "computed style red - IE 8");
});