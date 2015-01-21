var jsdom = require('jsdom');
var React = require('react');
var classSet = require('react/lib/cx');
var ReactTestUtils = require('react/lib/ReactTestUtils');
var Immutable = require('immutable');
var _ = require('lodash');

var schema = require('../lib/schema');
var FormContext = require('../lib/FormContext');
var FormMixin = require('../lib/FormMixin');
var Field = require('../lib/Field');

function renderReact(component) {
  var document = global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
  global.window = document.defaultView;
  global.reactTree = ReactTestUtils.renderIntoDocument(component);
  return global.reactTree;
}

function $(sel) {
  if (sel.indexOf('.') === 0) {
    return ReactTestUtils.findRenderedDOMComponentWithClass(global.reactTree, sel.slice(1)).getDOMNode();
  } else {
    return ReactTestUtils.findRenderedDOMComponentWithTag(global.reactTree, sel).getDOMNode();
  }
}

exports.Field = function(test) {

  var context = FormContext(Immutable.Map({
    foo: 'bar'
  }), schema.Mapping({
    foo: schema.Scalar(_.isString)
  }));

  function render() {
    renderReact(React.createElement('div', null,
      React.createElement(Field, {
        input: React.createElement('input'),
        keyPath: ['foo'],
        formContext: context
      })
    ));
  }
  render();
  test.strictEqual($('input').value, 'bar');
  ReactTestUtils.Simulate.change($('input'), {target: {value: 'spam'}});

  render();
  test.strictEqual($('input').value, 'spam');
  test.done();
};

exports.Form = function(test) {
  var Form = React.createClass({
    mixins: [FormMixin],
    getSchema: function() {
      return schema.Mapping({
        foo: schema.Scalar(function(val) {
          return _.isString(val) && val.length > 3;
        })
      });
    },
    render: function() {
      return React.createElement('form', {className: classSet({valid: this.state.isValid})},
        React.createElement(Field, {
          input: React.createElement('input'),
          keyPath: ['foo'],
          formContext: this.getFormContext()
        })
      );
    }

  });

  renderReact(React.createElement(Form));

  test.ok($('form').className === '');

  test.strictEqual($('input').value, '');

  ReactTestUtils.Simulate.change($('input'), {target: {value: 'foo'}});
  test.strictEqual($('input').value, 'foo');
  test.ok($('form').className === '');

  ReactTestUtils.Simulate.change($('input'), {target: {value: 'spam'}});
  test.ok($('form').className === 'valid');

  test.done();
};

exports.ComplexForm = function(test) {
  var Form = React.createClass({
    mixins: [FormMixin],
    getSchema: function() {
      return schema.Mapping({
        foo: schema.Scalar(function(v) { return v.length >= 1; }),
        bar: schema.Mapping({
          spam: schema.Scalar(function(v) { return v.length >= 3; })
        })
      });
    },
    getInitialValue: function() {
      return Immutable.Map({
        foo: '1',
        bar: Immutable.Map({
          spam: '333'
        })
      });
    },
    render: function() {
      return React.createElement('form', {className: classSet({valid: this.state.isValid})},
        React.createElement(Field, {
          keyPath: ['foo'],
          input: React.createElement('input', {className: 'input-foo'}),
          formContext: this.getFormContext()
        }),
        React.createElement(Field, {
          keyPath: ['bar', 'spam'],
          input: React.createElement('input', {className: 'input-spam'}),
          formContext: this.getFormContext()
        })
      );
    }
  });
  var form = renderReact(React.createElement(Form));
  test.ok($('form').className === 'valid');

  ReactTestUtils.Simulate.change($('.input-foo'), {target: {value: ''}});
  test.ok($('form').className === '');
  test.ok($('.input-foo').className.indexOf('invalid') !== -1);

  ReactTestUtils.Simulate.change($('.input-foo'), {target: {value: 'foo'}});
  test.ok($('form').className === 'valid');
  test.ok($('.input-foo').className.indexOf('invalid') === -1);

  ReactTestUtils.Simulate.change($('.input-foo'), {target: {value: 'foo'}});
  test.ok($('form').className === 'valid');
  test.ok($('.input-foo').className.indexOf('invalid') === -1);

  ReactTestUtils.Simulate.change($('.input-spam'), {target: {value: '1'}});
  test.ok($('form').className === '');
  test.ok($('.input-foo').className.indexOf('invalid') === -1);
  test.ok($('.input-spam').className.indexOf('invalid') !== -1);

  ReactTestUtils.Simulate.change($('.input-spam'), {target: {value: 'spam'}});
  test.ok($('form').className === 'valid');
  test.ok($('.input-foo').className.indexOf('invalid') === -1);
  test.ok($('.input-spam').className.indexOf('invalid') === -1);

  test.ok(Immutable.is(form.getFormContext().getIn(), Immutable.fromJS({foo: 'foo', bar: {spam: 'spam'}})));
  test.done();
};

exports.FieldList = function(test) {
  var Form = React.createClass({
    mixins: [FormMixin],
    getSchema: function() {
      return schema.Mapping({
        list: schema.Collection(schema.Scalar(function(v) { return v.length >= 3; }))
      });
    },
    getInitialValue: function() {
      return Immutable.Map({
        list: Immutable.List(['foo', 'bar'])
      });
    },
    render: function() {
      return React.createElement('form', {className: classSet({valid: this.state.isValid})},
        Immutable.Range(0, this.state.value.get('list').size).map(function(idx) {
          return React.createElement(Field, {
            input: React.createElement('input', {className: 'input-' + idx}),
            keyPath: ['list', idx],
            formContext: this.getFormContext(),
            key: idx
          })
        }, this).toArray()
      );
    }
  });
  renderReact(React.createElement(Form));
  test.ok($('form').className === 'valid');
  test.ok($('.input-0').className.indexOf('invalid') === -1);
  test.ok($('.input-1').className.indexOf('invalid') === -1);

  ReactTestUtils.Simulate.change($('.input-0'), {target: {value: ''}});
  test.ok($('form').className === '');
  test.ok($('.input-0').className.indexOf('invalid') !== -1);
  test.ok($('.input-1').className.indexOf('invalid') === -1);
  test.done();
};
