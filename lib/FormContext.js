var EventEmitter = require('eventemitter3');
var Immutable = require('immutable');

function getChildSchema(schema, key) {
  return schema.get(key);
}

function FormContext(val, schema) {
  var emitter = new EventEmitter();

  return {
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
        emitter.emit('change');
      }
    },

    addListener: emitter.addListener.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter),
    removeAllListeners: emitter.removeAllListeners.bind(emitter)
  };
}

module.exports = FormContext;
