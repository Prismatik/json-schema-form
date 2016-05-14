import { cloneDeep, flow, isObjectLike } from 'lodash';
import schema from './valid_schema.json';

const validSchema = flow(cloneDeep, deepFreeze)(schema);
export default validSchema;

function deepFreeze(obj) {
  Object.getOwnPropertyNames(obj).forEach(name => {
    const val = obj[name];
    if (isObjectLike(val)) deepFreeze(val);
  });
  return Object.freeze(obj);
}
