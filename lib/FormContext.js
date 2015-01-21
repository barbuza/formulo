var Immutable = require('immutable');
var freeze = require('./freeze');

function getChildSchema(schema, key) {
  return schema.get(key);
}

function callListener(listener) {
  listener();
}

function FormContext(val, schema) {
  var listeners = Immutable.Set();

  return freeze({
    getIn: function(keyPath) {
      return val.getIn(keyPath || []);
    },

    isValid: function() {
      return schema.isValid(val);
    },

    getSchema: function(keyPath) {
      return (keyPath || []).reduce(getChildSchema, schema);
    },

    setIn: function(keyPath, value) {
      var newVal = val.setIn(keyPath || [], value);
      if (!Immutable.is(val, newVal)) {
        val = newVal;
        listeners.forEach(callListener);
      }
    },

    extendIn: function(keyPath) {
      var schema = this.getSchema(keyPath);
      var value = this.getIn(keyPath);
      this.setIn(keyPath, value.push(schema.get(0).default));
    },

    resetIn: function(keyPath) {
      this.setIn(keyPath, this.getSchema(keyPath).default);
    },

    addListener: function(listener) {
      listeners = listeners.add(listener);
    },

    removeListener: function(listener) {
      listeners = listeners.remove(listener);
    }
  });
}

module.exports = FormContext;
