import { stringify } from 'querystring';
import {
  BooleanParam,
  encodeQueryParams,
  JsonParam,
  NumberParam,
  StringParam,
} from 'serialize-query-params';
import { debug as deb } from 'debug';

const debug = deb('Param-Serializer');

export function SerializeParams(obj: Object) {
  if (!obj) return '';
  try {
    // Top-Level Object Traversal
    const paramMap = Object.entries(obj).reduce((pMap, [key, param]) => {
      switch (typeof param) {
        case 'object':
          pMap = { ...pMap, [key]: JsonParam };
          break;
        case 'number':
          pMap = { ...pMap, [key]: NumberParam };
          break;
        case 'string':
          pMap = { ...pMap, [key]: StringParam };
          break;
        case 'boolean':
          pMap = { ...pMap, [key]: BooleanParam };
          break;
        default:
          throw new Error(
            'Unsupported Param type \nSupported type(s): Object, Array, Number, String, Boolean'
          );
      }
      return pMap;
    }, {});

    const encoded = encodeQueryParams(paramMap, obj);

    return `?${stringify(encoded)}`;
  } catch (err) {
    debug('Error: Serializing Params', err);
    throw err;
  }
}
