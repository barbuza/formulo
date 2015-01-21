var React = require('react');
var cloneWithProps = require('react/lib/cloneWithProps');
var classSet = require('react/lib/cx');

var Field = React.createClass({

  displayName: 'Field',

  getDefaultProps: function() {
    return {
      validClass: 'valid',
      invalidClass: 'invalid'
    };
  },

  propTypes: {
    keyPath: React.PropTypes.arrayOf(
      React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ])
    ).isRequired,

    input: React.PropTypes.element.isRequired,

    formContext: React.PropTypes.shape({
      getSchema: React.PropTypes.func.isRequired,
      getIn: React.PropTypes.func.isRequired,
      setIn: React.PropTypes.func.isRequired
    }).isRequired,

    validClass: React.PropTypes.string,

    invalidClass: React.PropTypes.string
  },

  onChange: function(event) {
    this.props.formContext.setIn(this.props.keyPath, event.target.value);
  },

  render: function() {
    var formContext = this.props.formContext;
    var value = formContext.getIn(this.props.keyPath);
    var schema = formContext.getSchema(this.props.keyPath);
    var valid = schema.isValid(value);

    var classes = {};
    classes[this.props.validClass] = valid;
    classes[this.props.invalidClass] = !valid;

    return cloneWithProps(this.props.input, {
      value: value,
      onChange: this.onChange,
      className: classSet(classes)
    });
  }

});

module.exports = Field;