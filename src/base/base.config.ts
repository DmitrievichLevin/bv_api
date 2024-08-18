import { CREDENTIALS } from '../env';
import { HTTPOptions } from '../global';
import { debug as deb } from 'debug';

const debug = deb('base.config');

const defaultOptions: HTTPOptions = {
  method: 'GET',
  body: {},
  referrer: 'about:client',
  referrerPolicy: 'strict-origin-when-cross-origin',
  mode: 'cors',
  credentials: CREDENTIALS,
  cache: 'default',
  redirect: 'follow',
  integrity: '',
  keepalive: false,
  signal: undefined,
  window: null,
};

debug('Options: ', defaultOptions);

export { defaultOptions };
