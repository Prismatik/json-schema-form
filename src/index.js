import flat from 'flat';
import _, { flowRight, fromPairs, head, isUndefined, map, reduce } from 'lodash';

const flatten = (obj, opts = { safe: true }) => flat(obj, opts);

export function mapData(schema, data) {
  const schemaProps = extractHeaders(schema.properties);
  const iterator = (flatValue, prop) => {
    let value = flatValue[prop];
    if (schema.links) value = valueToLink(schema.links, prop, value);
    if (Array.isArray(value)) value = arrayToStr(value);
    return [prop, value];
  };

  return mapSchema(schemaProps, data, iterator);
}

export function toFormInputs(schema = { required: [] }, data) {
  const schemaProps = flowRight(flatten, extractProps)(schema.properties);
  const iterator = (flatValue, prop, key) => {
    const parsed = JSON.parse(prop);

    if (parsed.type === 'string') parsed.type = 'text';
    if (schema.required.indexOf(key) >= 0) parsed.required = true;
    parsed.value = flatValue[key];

    return [key, _(parsed).omit('faker').omitBy(isUndefined).value()];
  };

  data = data || Object.keys(schemaProps);

  return head(mapSchema(schemaProps, data, iterator));
}

function extractHeaders(schemaProps) {
  return flowRight(Object.keys, flatten, extractProps)(schemaProps);
}

function arrayToStr(array) { return `[${array.join(', ')}]`; }

function mapSchema(props, data, iterator) {
  if (!Array.isArray(data)) data = [data];
  return data.map(value => {
    const flatValue = flatten(value);
    return fromPairs(map(props, iterator.bind(null, flatValue)));
  });
}

function extractProps(obj) {
  return reduce(obj, (result, value, key) => {
    if (!value.type) result[key] = extractProps(value);
    else result[key] = JSON.stringify(value);
    return result;
  }, {});
}

function valueToLink(links, prop, value) {
  const index = map(links, 'rel').indexOf(prop);
  if (index >= 0) return links[index].href.replace(`{${prop}}`, value);
  return value;
}
