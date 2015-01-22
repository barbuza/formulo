# formulo - simple stupid react forms

[![npm version](https://badge.fury.io/js/formulo.svg)](http://badge.fury.io/js/formulo)

[![Build Status](https://snap-ci.com/barbuza/formulo/branch/master/build_image)](https://snap-ci.com/barbuza/formulo/branch/master)

[Demo](http://barbuza.github.io/formulo)

### simple form

```jsx
var Form = React.createClass({

  mixins: [formulo.FormMixin],

  getSchema() {
    return formulo.schema.Mapping({
      foo: formulo.schema.Scalar(_.isString),
      bar: formulo.schema.Scalar(x => _.isString(x) && x.length >= 3),
    });
  },

  render() {
    return (
      <form className={React.addons.classSet({active: this.state.isValid})}>
        <formulo.Field input={<input />} keyPath={['foo']} formContext={this.getFormContext()} />
        <formulo.Field input={<input />} keyPath={['bar']} formContext={this.getFormContext()} />
      </form>
    );
  }

});
```

### list example

```jsx
var Form = React.createClass({

  mixins: [formulo.FormMixin],

  getSchema() {
    return formulo.schema.Mapping({
      list: formulo.schema.Collection(formulo.schema.Scalar(v => v.length >= 3))
    });
  },

  getInitialValue() {
    return Immutable.Map({
      list: Immutable.List(['foo', 'bar'])
    });
  },

  render() {
    return (
      <form className={React.addons.classSet({active: this.state.isValid})}>
        {this.state.value.get('list').map(function(_, idx) {
          return <formulo.Field input={<input />} keyPath={['list', idx]} formContext={this.getFromContext()} key={idx} />
        }, this).toArray()};
      </form>
    );
  }

});
```
