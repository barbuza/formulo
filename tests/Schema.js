var Immutable = require('immutable');
var schema = require('../lib/schema');

var stringScalar = schema.Scalar(function(value) { return typeof value === 'string'; });
var numberScalar = schema.Scalar(function(value) { return typeof value === 'number'; });
var truly = schema.Scalar();
var falsy = schema.Scalar(function() { return false; });

exports.Scalar = function(test) {
  test.ok(truly.isValid('foo'));
  test.ok(!falsy.isValid('foo'));
  test.strictEqual(truly.getDefault(), '');
  test.done();
};

exports.Collection = function(test) {
  var trulyCollection = schema.Collection(truly);
  test.ok(trulyCollection.isValid(Immutable.List()));
  test.ok(trulyCollection.isValid(Immutable.List([1, 'foo', undefined])));
  test.ok(Immutable.is(trulyCollection.getDefault(), Immutable.List()));

  var stringCollection = schema.Collection(stringScalar);
  test.ok(stringCollection.isValid(Immutable.List()));
  test.ok(stringCollection.isValid(Immutable.List(['foo', 'bar'])));
  test.ok(!stringCollection.isValid(Immutable.List(['foo', 'bar', 1])));
  test.done();

  var minLengthCollection = schema.Collection(stringScalar, function(value) { return value.size >= 1; });
  test.ok(!minLengthCollection.isValid(Immutable.List()));
  test.ok(minLengthCollection.isValid(Immutable.List(['foo'])));
  test.ok(!minLengthCollection.isValid(Immutable.List(['foo', 1])));
};

exports.Mapping = function(test) {
  var mapping = schema.Mapping({
    'str': stringScalar,
    'num': numberScalar
  });
  test.ok(mapping.isValid(Immutable.Map({str: 'foo', num: 1})));
  test.ok(!mapping.isValid(Immutable.Map({str: 'foo'})));
  test.ok(!mapping.isValid(Immutable.Map({num: 1})));
  test.ok(!mapping.isValid(Immutable.Map({str: 'foo', num: 'spam'})));
  test.ok(!mapping.isValid(Immutable.Map({str: 1, num: 1})));
  test.ok(Immutable.is(mapping.getDefault(), Immutable.Map({str: '', num: ''})));
  test.done();
};
