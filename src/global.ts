export type HTTPMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export type APIRequestType =
  | 'get'
  | 'post'
  | 'delete'
  | 'put'
  | 'patch'
  | 'getById'
  | 'postWOP';

export type HTTPOptions = {
  method: HTTPMethod;
  // headers: Headers;
  body: { [key: string]: any } | FormData | Blob | URLSearchParams; // string, FormData, Blob, BufferSource, or URLSearchParams
  referrer: 'about:client'; // or "" to send no Referer header,
  // or an url from the current origin
  referrerPolicy: 'strict-origin-when-cross-origin'; // no-referrer-when-downgrade, no-referrer, origin, same-origin...
  mode: 'cors'; // same-origin, no-cors
  credentials: 'same-origin' | 'omit' | 'include';
  cache: 'default'; // no-store, reload, no-cache, force-cache, or only-if-cached
  redirect: 'error' | 'follow' | 'manual'; // manual, error
  /**
   * @TODO - Implement Sha Hash integrity
   */
  integrity: ''; // a hash, like "sha256-abcdef1234567890"
  keepalive: false; // true
  signal: undefined; // AbortController to abort request
  window: Window | null;
};

export type HTTPRequest = () => Promise<Response>;

export type EndPointMethod = { name: APIRequestType; http: HTTPMethod };

export type EndPoint = {
  path: string;
  methods: Array<EndPointMethod>;
  resource: string;
};

export type APIPropertyValue = Function | HTTPRequest | HTTPOptions | string;

export type Dict = { [key: string]: APIPropertyValue | undefined };

export type APIConstructorProps = {
  path: string;
  request?: HTTPOptions;
};

type DisabledRequest = (...args: any[]) => Promise<any>;
export type APIMethods = {
  get: HTTPRequest | DisabledRequest;
  post: HTTPRequest | DisabledRequest;
  patch: HTTPRequest | DisabledRequest;
  delete: HTTPRequest | DisabledRequest;
};

/**
 * Get Request Case
 * @param Query
 */
export const getOP: string = 'get';

/**
 * Get by id Request Case
 * @param Query
 */
export const getByIdOP: string = 'getById';

/**
 * Post Request Case
 * @param null
 */
export const postOP: string = 'post';

/**
 * Put Request Case
 * @param resourceId
 */
export const putOP: string = 'put';

/**
 * Patch Request Case
 * @param null
 */
export const patchOP: string = 'patch';

/**
 * Patch Request Case
 * @param null
 */
export const deleteOP: string = 'delete';

/**
 * WOP Query Types
 */
type NotOP = '!' | '';

export type QueryOP = '>' | '<' | '>=' | '<=' | '=' | '!=' | '';

export type QueryKey = string | '';

export type QueryVal = string | '';

export type Query = `${NotOP}${QueryKey}${QueryOP}${QueryVal}`;

export type APIProperties = APIConstructorProps & APIMethods;

export interface APIInterface extends APIProperties {}

export interface APIConstructor extends APIProperties {
  new ({
    path,
    request,
  }: {
    path: string;
    request?: HTTPOptions;
  }): APIInterface;
}

export type ResrcData = { id: string; [key: string]: any };
