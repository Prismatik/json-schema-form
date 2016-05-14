'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toData = toData;
exports.toFormInputs = toFormInputs;

var _flat = require('flat');

var _flat2 = _interopRequireDefault(_flat);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var flatten = function flatten(obj) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? { safe: true } : arguments[1];
  return (0, _flat2.default)(obj, opts);
};

function toData(schema, data) {
  var schemaProps = extractHeaders(schema.properties);
  var iterator = function iterator(flatValue, prop) {
    var value = flatValue[prop];
    if (schema.links) value = valueToLink(schema.links, prop, value);
    if (Array.isArray(value)) value = arrayToStr(value);
    return [prop, value];
  };

  return mapSchema(schemaProps, data, iterator);
}

function toFormInputs() {
  var schema = arguments.length <= 0 || arguments[0] === undefined ? { required: [] } : arguments[0];
  var data = arguments[1];

  var schemaProps = (0, _lodash.flowRight)(flatten, extractProps)(schema.properties);
  var iterator = function iterator(flatValue, prop, key) {
    var parsed = JSON.parse(prop);

    if (parsed.type === 'string') parsed.type = 'text';
    if (schema.required.indexOf(key) >= 0) parsed.required = true;
    parsed.value = flatValue[key];

    return [key, (0, _lodash2.default)(parsed).omit('faker').omitBy(_lodash.isUndefined).value()];
  };

  data = data || Object.keys(schemaProps);

  return (0, _lodash.head)(mapSchema(schemaProps, data, iterator));
}

function extractHeaders(schemaProps) {
  return (0, _lodash.flowRight)(Object.keys, flatten, extractProps)(schemaProps);
}

function arrayToStr(array) {
  return '[' + array.join(', ') + ']';
}

function mapSchema(props, data, iterator) {
  if (!Array.isArray(data)) data = [data];
  return data.map(function (value) {
    var flatValue = flatten(value);
    return (0, _lodash.fromPairs)((0, _lodash.map)(props, iterator.bind(null, flatValue)));
  });
}

function extractProps(obj) {
  return (0, _lodash.reduce)(obj, function (result, value, key) {
    if (!value.type) result[key] = extractProps(value);else result[key] = JSON.stringify(value);
    return result;
  }, {});
}

function valueToLink(links, prop, value) {
  var index = (0, _lodash.map)(links, 'rel').indexOf(prop);
  if (index >= 0) return links[index].href.replace('{' + prop + '}', value);
  return value;
}