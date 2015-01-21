var Immutable = require('immutable');

function alwaysValid() {
  return true;
}

function Scalar(validator) {
  if (validator === void 0) {
    validator = alwaysValid;
  }

  return {
    isValid: function(value) {
      return validator(value);
    },

    getDefault: function() {
      return '';
    }
  }
}

var emptyList = Immutable.List();

function Collection(child, validator) {
  if (validator === void 0) {
    validator = alwaysValid;
  }

  return {
    isValid: function(value) {
      return (value instanceof Immutable.List)
        && value.every(child.isValid)
        && validator(value);
    },

    getDefault: function() {
      return emptyList;
    },

    get: function() {
      return child;
    }
  }
}

function getChildDefault(child) {
  return child.getDefault();
}

function Mapping(children, validator) {
  if (validator === void 0) {
    validator = alwaysValid;
  }
  children = Immutable.Map(children);
  var defaultValue = children.map(getChildDefault);

  return {
    isValid: function(value) {
      return (value instanceof Immutable.Map)
        && children.every(function(child, key) { return child.isValid(value.get(key)); })
        && validator(value);
    },

    getDefault: function() {
      return defaultValue;
    },

    get: function(key) {
      return children.get(key);
    }
  }
}

exports.Scalar = Scalar;
exports.Collection = Collection;
exports.Mapping = Mapping;
