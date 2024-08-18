import {
  APIInterface,
  APIRequestType,
  deleteOP,
  EndPointMethod,
  getByIdOP,
  getOP,
  HTTPMethod,
  HTTPOptions,
  patchOP,
  postOP,
  putOP,
  Query,
  ResrcData,
} from '../global';
import { defaultOptions } from './base.config';
import { applyOperation, deepClone, compare, validate } from 'fast-json-patch';
import { SerializeParams } from './helpers';
import { debug as deb } from 'debug';
import { REQ_TIMEOUT, URL } from '../env';
import Cookies from 'js-cookie';

var reqTimeout = parseInt(REQ_TIMEOUT, 10);

const debug = deb('base.api');

const DisabledMethod = async (...args: any[]) =>
  new Promise((_, rej) => rej('Request Method not available.'));

type PackageGlobal = { [key: string]: any; headers: Headers };

/**
 * Abstract class for API(s).
 * @class
 * @extends Object.prototype
 * @param APIConstructorProps
 * @returns API Instance
 */
class API implements APIInterface {
  constructor({
    path,
    global,
    options = {} as HTTPOptions,
    methods = [],
  }: {
    path: string;
    global: PackageGlobal;
    options?: HTTPOptions;
    methods: EndPointMethod[];
  }) {
    // Get name of class - API + 's'
    this.name = this.constructor.name.split('API')[0].toLowerCase();

    // Global Self {headers}
    this.global = global;

    // Check for Auth Cookie
    this.__getAuth();

    this.path = path;
    this.options = { ...options, ...this.options };

    // Add Methods
    methods.forEach((endpoint: EndPointMethod) => {
      this.__add(endpoint);
    });
  }
  path = '/';
  options = defaultOptions;
  private __getAuth = () => {
    var auth = Cookies.get('access-token');
    if (auth) {
      this.global.headers.set('Authorization', auth);
    }
  };
  private __paramString = SerializeParams;
  /**
   * Decorates Request Function
   * @param method
   * @returns {HTTPRequest}
   */
  private __decorate = (method: HTTPMethod, operation: APIRequestType) => {
    async function Request(
      arg0: ResrcData | string,
      arg1?: ResrcData
    ): Promise<any> {
      // Request Timeout
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort('Server took too long to respond.'),
        reqTimeout
      );

      let params: string = '';
      let body: { [key: string]: any } = {};

      switch (operation) {
        case getOP:
          params = SerializeParams(arg0);
          body = undefined;
          break;
        case getByIdOP:
          var paramType = typeof arg0;
          if (paramType !== 'string') {
            throw new Error(
              `Expected id of type string, but found ${paramType}.`
            );
          } else {
            params = `?id=${arg0}`;
          }
          break;
        case postOP:
          body = arg0 as ResrcData;
          break;
        case putOP:
          body = arg0 as ResrcData;
          const { id } = { id: undefined, ...(arg0 as ResrcData) };
          params = SerializeParams(id ? { id } : null);
          break;
        case patchOP:
          // Original
          const { id: idOne } = arg0 as ResrcData;
          // Patch
          const { id: idTwo } = arg1 as ResrcData;

          if (idOne !== idTwo) {
            throw new Error('Mismatch ID(s) on original & patch in request.');
          } else {
            var diff = compare(arg0, arg1);
            validate(diff, arg0);
            body = { id: idOne, patch: diff };
          }
          break;
        case deleteOP:
          params = SerializeParams(arg0 ? { id: arg0 } : null);
          body = undefined;
          break;
        default:
          throw new Error(`Unknown operation, found ${operation}.`);
      }
      return fetch(`${URL}${this.path}${params}`, {
        ...this.options,
        method,
        headers: this.global.headers,
        body: this.__serializeBody(body),
        signal: controller.signal,
      })
        .then(this.__processResponse)
        .finally(() => {
          clearTimeout(timeout);
        });
    }
    return Request as APIRequest;
  };

  /**
   *
   * @param response
   * @summary Processing: Cookies, Headers, etc.
   * @returns {object}
   */
  private __processResponse = async (response: { [key: string]: any }) => {
    // Set auth cookie/header
    let authToken = response.headers.get('Authorization');
    if (authToken) {
      this.global.headers.set('Authorization', authToken);
      Cookies.set('access-token', authToken);
    }

    // Check content-type header for application/stream+json to return json-stream
    let content_type = response.headers.get('content-type');
    if (content_type === 'application/stream+json') return response;

    // OK
    if (199 < response.status && response.status < 300) {
      // No-Content
      if (response.status == 204) return { data: null };
      return response.json();
    }
    // Redirect
    else if (299 < response.status && response.status < 400) {
      return;
    } else {
      var err = await response.json();
      // Remove Expired Tokens
      if (err?.authError) {
        Cookies.remove('access-token');
      }
      throw new Error(err.message);
    }
  };
  /**
   * Add API Request Type
   * @param endpoint
   * @augments API
   * @returns
   */
  private __add = function (endpoint: EndPointMethod) {
    const { name, http: method } = endpoint;
    let func = this.__decorate(method, name);
    func.bind(this);
    this[name] = func;
  };

  /**
   * SerializeBody
   * @summary Serialize Request Body.
   * @param _body request input
   * @returns {Object | FormData} JSON or Formdata if File(s) included in body.
   */
  private __serializeBody = (_body: { [key: string]: any } | undefined) => {
    if (!_body) {
      return undefined;
    } else {
      this.global.headers.set('Content-Type', 'application/json');
    }

    const body_form = new FormData();

    let isForm = false;

    Object.entries(_body).forEach(([key, value]) => {
      if (value instanceof File) {
        isForm = true;
        this.global.headers.delete('Content-Type');
      }
      body_form.set(key, value);
    });

    return isForm ? body_form : JSON.stringify(_body);
  };

  global: PackageGlobal;
  get = DisabledMethod;
  post = DisabledMethod;
  patch = DisabledMethod;
  delete = DisabledMethod;

  /**
   * Name of MVC
   */
  name: string;
}

interface APIRequest extends Function {
  // GET
  (query: Query): Promise<Response>;
  // GETBYID
  (id: string): Promise<Response>;
  // POST
  (newObj: Object): Promise<Response>;
  // PATCH
  (original: Object, patch: Object): Promise<Response>;
  // PUT
  (newResource: Object): Promise<Response>;
  // DELETE
  (originalResource: Object): Promise<Response>;
}

export default API;
