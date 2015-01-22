var React = require('react');
var classSet = require('react/lib/cx');
var cloneWithProps = require('react/lib/cloneWithProps');
var assign = require('react/lib/Object.assign');
var Immutable = require('immutable');
require('bootstrap/dist/css/bootstrap.css');

var {FormMixin, Field, schema} = require('../');

var ContextField = React.createClass({

  contextTypes: {
    formContext: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      validClass: null,
      invalidClass: null
    };
  },

  render() {
    var props = assign({}, this.props, {input: this.props.children, formContext: this.context.formContext});
    return <Field {...props} />;
  }

});

function required(val) {
  return !!val.length;
}

var booleanSchema = {
  isValid(val) {
    return _.isBoolean(val);
  },

  default: false
};

var requiredScalar = schema.Scalar(required);

function makeLabel(str) {
  str = str.split(/(?=[A-Z])/g).join(' ');
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

var FormGroup = React.createClass({

  contextTypes: {
    formContext: React.PropTypes.object
  },

  render() {
    var value = this.context.formContext.getIn(this.props.keyPath);
    var isValid = this.context.formContext.getSchema(this.props.keyPath).isValid(value);
    var id = `input${this._rootNodeID}`;
    var label = _.isString(_.last(this.props.keyPath)) ? <label className='control-label' htmlFor={id}>{makeLabel(_.last(this.props.keyPath))}</label> : null;
    return (
      <div className={classSet({'form-group': true, 'has-success': isValid, 'has-error': !isValid})}>
        {label}
        <ContextField {...this.props}>
          {cloneWithProps(this.props.children || <input />, {id, className: 'form-control input-sm'})}
        </ContextField>
      </div>
    );
  }

});

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
    this.getFormContext().resetIn([]);
  },

  addItem(e) {
    e.preventDefault();
    this.getFormContext().extendIn(['items']);
  },

  addFriend(e) {
    e.preventDefault();
    this.getFormContext().extendIn(['friends']);
  },

  render() {
    return (
      <form>
        <h1>formulo <small>demo</small></h1>
        <div className='row'>
          <div className='col-xs-6'>
            <FormGroup keyPath={['firstName']} />
            <FormGroup keyPath={['lastName']} />
            <div className='checkbox'>
              <label>
                <ContextField keyPath={['check']} valueProp='checked'>
                  <input type='checkbox' />
                </ContextField>
                Check me out
              </label>
            </div>

            <div className='form-group'>
              <label className='control-label'>Items</label>
              <div>
                {this.state.value.get('items').map((_, idx) =>
                  <FormGroup keyPath={['items', idx]} key={idx} />
                ).toArray()}
              </div>
              <button className='btn btn-default btn-xs btn-primary' onClick={this.addItem}>add</button>
            </div>

            <div className='form-group'>
              <label className='control-label'>Friends</label>
              <div>
                {this.state.value.get('friends').map((_, idx) =>
                  <div className='row' key={idx}>
                    <div className='col-xs-6'>
                      <FormGroup keyPath={['friends', idx, 'firstName']} />
                    </div>
                    <div className='col-xs-6'>
                      <FormGroup keyPath={['friends', idx, 'lastName']} />
                    </div>
                  </div>
                ).toArray()}
              </div>
              <button className='btn btn-default btn-xs btn-primary' onClick={this.addFriend}>add</button>
            </div>
            <div className='btn-group'>
              <button type='button' className='btn btn-default btn-success' onClick={this.populate}>populate</button>
              <button type='button' className='btn btn-default btn-danger' onClick={this.reset}>reset</button>
            </div>
          </div>
          <div className='col-xs-6'>
            <pre>{JSON.stringify(this.state.value, null, 2)}</pre>
          </div>
        </div>
      </form>
    );
  }

});


React.render(<Form />, document.getElementById('app'));
