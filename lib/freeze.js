var _ = require('lodash');

module.exports = (process.env.NODE_ENV === 'production') ? _.identity : Object.freeze;
