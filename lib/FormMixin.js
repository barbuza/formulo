var Immutable = require('immutable');
var FormContext = require('./FormContext');

module.exports = {

  getFormContext: function() {
    if (!this._formContext) {
      var initialValue = Immutable.Map();
      if (typeof this.getInitialValue === 'function') {
        initialValue = this.getInitialValue();
      }
      var schema = this.getSchema();
      initialValue = schema.getDefault().mergeDeep(initialValue);
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
    this.getFormContext().addListener('change', this.formContextChanged);
  },

  componentWillUnmount: function() {
    this.getFormContext().removeListener('change', this.formContextChanged);
  },

  formContextChanged: function() {
    this.setState(this.getFormState());
  }

};
