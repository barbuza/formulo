var Immutable = require('immutable');
var _ = require('lodash');
var FormContext = require('./FormContext');

module.exports = {

  getFormContext: function() {
    if (!this._formContext) {
      var schema = this.getSchema();
      var initialValue = schema.default;
      if (_.isFunction(this.getInitialValue)) {
        initialValue = initialValue.mergeDeep(this.getInitialValue());
      }
      this._formContext = FormContext(initialValue, schema);
    }
    return this._formContext;
  },

  getFormState: function() {
    var formContext = this.getFormContext();
    return {
      isValid: formContext.isValid(),
      value: formContext.getIn()
    };
  },

  getInitialState: function() {
    return this.getFormState();
  },

  componentDidMount: function() {
    this.getFormContext().addListener(this.formContextChanged);
  },

  componentWillUnmount: function() {
    this.getFormContext().removeListener(this.formContextChanged);
  },

  formContextChanged: function() {
    this.setState(this.getFormState());
  }

};
