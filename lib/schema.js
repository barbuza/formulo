var Immutable = require('immutable');
var _ = require('lodash');
var freeze = require('./freeze');

var alwaysValid = _.constant(true);

function Scalar(validator) {
  if (validator === void 0) {
    validator = alwaysValid;
  }

  return freeze({
    isValid: function(value) {
      return validator(value);
    },

    default: ''
  });
}

var emptyList = Immutable.List();

function Collection(child, validator) {
  if (validator === void 0) {
    validator = alwaysValid;
  }

  return freeze({
    isValid: function(value) {
      return (value instanceof Immutable.List)
        && value.every(child.isValid)
        && validator(value);
    },

    get: function() {
      return child;
    },

    default: emptyList
  });
}

function getChildDefault(child) {
  return child.default;
}

function Mapping(children, validator) {
  if (validator === void 0) {
    validator = alwaysValid;
  }
  children = Immutable.Map(children);
  var defaultValue = children.map(getChildDefault);

  return freeze({
    isValid: function(value) {
      return (value instanceof Immutable.Map)
        && children.every(function(child, key) { return child.isValid(value.get(key)); })
        && validator(value);
    },

    get: function(key) {
      return children.get(key);
    },

    default: defaultValue
  });
}

module.exports = {
  Scalar: Scalar,
  Collection: Collection,
  Mapping: Mapping
};
