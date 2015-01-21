var React = require('react');
var classSet = require('react/lib/cx');
var assign = require('react/lib/Object.assign');
var Immutable = require('immutable');
var {FormMixin, schema} = formulo = require('../');

var ContextField = React.createClass({

  contextTypes: {
    formContext: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      validClass: 'FieldValid',
      invalidClass: 'FieldInvalid'
    };
  },

  render() {
    var props = assign({}, this.props, {input: this.props.children, formContext: this.context.formContext});
    return <formulo.Field {...props} />;
  }

});

function required(val) {
  return !!val.length;
}

var booleanSchema = {
  isValid(val) {
    return _.isBoolean(val);
  },

  getDefault() {
    return false;
  }
};

var requiredScalar = schema.Scalar(required);

var Form = React.createClass({

  mixins: [FormMixin],

  childContextTypes: {
    formContext: React.PropTypes.object
  },

  getChildContext() {
    return {
      formContext: this.getFormContext()
    };
  },

  getSchema() {
    return schema.Mapping({
      firstName: requiredScalar,
      lastName: requiredScalar,
      check: booleanSchema,
      items: schema.Collection(requiredScalar),
      friends: schema.Collection(schema.Mapping({
        firstName: requiredScalar,
        lastName: requiredScalar
      }))
    });
  },

  populate(e) {
    e.preventDefault();
    this.getFormContext().setIn([], Immutable.fromJS({
      firstName: 'foo',
      lastName: 'bar',
      check: true,
      items: ['spam', 'eggs'],
      friends: [{
        firstName: 'lorem',
        lastName: 'ipsum'
      }]
    }));
  },

  reset(e) {
    e.preventDefault();
    this.getFormContext().setIn([], this.getFormContext().getSchema([]).getDefault());
  },

  addItem(e) {
    e.preventDefault();
    var formContext = this.getFormContext();
    formContext.setIn(['items'], formContext.getIn(['items']).push(formContext.getSchema(['items', 0]).getDefault()));
  },

  addFriend(e) {
    e.preventDefault();
    var formContext = this.getFormContext();
    formContext.setIn(['friends'], formContext.getIn(['friends']).push(formContext.getSchema(['friends', 0]).getDefault()));
  },

  render() {
    return (
      <form className={classSet({Form: true, FormValid: this.state.isValid, FormInvalid: !this.state.isValid})}>
        <div className='FormRow'>
          <label className='Label' htmlFor='firstName'>First name</label>
          <ContextField keyPath={['firstName']}>
            <input className='Field' id='firstName' />
          </ContextField>
        </div>
        <div className='FormRow'>
          <label className='Label' htmlFor='lastName'>Last name</label>
          <ContextField keyPath={['lastName']}>
            <input className='Field' id='lastName' />
          </ContextField>
        </div>
        <div className='FormRow'>
          <label className='Label' htmlFor='check'>Check</label>
          <ContextField keyPath={['check']} valueProp='checked'>
            <input className='Field' id='check' type='checkbox' />
          </ContextField>
        </div>

        <div className='FormRow'>
          <label className='Label'>Items</label>
          <button onClick={this.addItem}>add</button>
          {this.state.value.get('items').map((_, idx) =>
            <ContextField keyPath={['items', idx]} key={idx}>
              <input className='Field' id={'items-' + idx} />
            </ContextField>
          ).toArray()}
        </div>
        <div className='FormRow'>
          <label className='Label'>Friends</label>
          <button onClick={this.addFriend}>add</button>
          {this.state.value.get('friends').map((_, idx) =>
            <div className='Friend' key={idx}>
              <ContextField keyPath={['friends', idx, 'firstName']}>
                <input className='Field' id={`friends-${idx}-firstName`} />
              </ContextField>
              <ContextField keyPath={['friends', idx, 'lastName']}>
                <input className='Field' id={`friends-${idx}-lastName`} />
              </ContextField>
            </div>
          ).toArray()}
        </div>
        <div className='Controls'>
          <button onClick={this.populate}>populate</button>
          <button onClick={this.reset}>reset</button>
        </div>
        <div className='Value'>value: {this.state.value.toString()}</div>
      </form>
    );
  }

});


React.render(<Form />, document.getElementById('app'));
