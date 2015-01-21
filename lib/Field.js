var React = require('react');
var cloneWithProps = require('react/lib/cloneWithProps');
var classSet = require('react/lib/cx');
var shallowEqual = require('react/lib/shallowEqual');
var Immutable = require('immutable');
var _ = require('lodash');

var Field = React.createClass({

  displayName: 'Field',

  getDefaultProps: function() {
    return {
      validClass: 'valid',
      invalidClass: 'invalid',
      valueProp: 'value'
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

    invalidClass: React.PropTypes.string,

    valueProp: React.PropTypes.string
  },

  shouldComponentUpdate: function(nextProps) {
    return !Immutable.is(nextProps.formContext.getIn(nextProps.keyPath), this._seenValue)
      || !shallowEqual(nextProps.keyPath, this.props.keyPath)
      || !_.isEqual(nextProps.input, this.props.input)
      || nextProps.valueProp !== this.props.valueProp
      || nextProps.validClass !== this.props.validClass
      || nextProps.invalidClass !== this.props.invalidClass
      || nextProps.formContext.getSchema(nextProps.keyPath) !== this.props.formContext.getSchema(this.props.keyPath);
  },

  _trackSeenValue: function() {
    this._seenValue = this.props.formContext.getIn(this.props.keyPath);
  },

  componentDidMount: function() {
    this._trackSeenValue();
  },

  componentDidUpdate: function() {
    this._trackSeenValue();
  },

  onChange: function(event) {
    this.props.formContext.setIn(this.props.keyPath, event.target[this.props.valueProp]);
  },

  render: function() {
    var formContext = this.props.formContext;
    var value = formContext.getIn(this.props.keyPath);
    var schema = formContext.getSchema(this.props.keyPath);
    var valid = schema.isValid(value);

    var classes = {};
    if (this.props.validClass) {
      classes[this.props.validClass] = valid;
    }
    if (this.props.invalidClass) {
      classes[this.props.invalidClass] = !valid;
    }

    var inputProps = {
      onChange: this.onChange,
      className: classSet(classes)
    };
    inputProps[this.props.valueProp] = value;

    return cloneWithProps(this.props.input, inputProps);
  }

});

module.exports = Field;
