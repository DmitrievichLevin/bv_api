import { debug as deb } from 'debug';
import { ObjectType } from 'typescript';
import API from '../base/base';
import { EndPointMethod } from '../global';
import { Endpoints } from '../endpoints/endpoints';

const debug = deb(`index`);

class APIPackage {
  constructor() {
    // Set Global Headers

    var self = this;

    try {
      Endpoints.forEach(endpoint => {
        const [_, firstLetter, rest, __] =
          endpoint.resource.split(/(^[a-zA-Z]{1})(.*)$/g);

        let className = firstLetter.toUpperCase() + rest + 'API';

        let api: API =
          this?.[className as keyof API] ??
          new API({
            path: endpoint.path,
            global: self,
            methods: endpoint.methods as EndPointMethod[],
          });

        this[className as keyof ObjectType] = api;
      }, {});
    } catch (err) {
      debug('Package Error: ', err);
      throw err;
    }
  }

  headers: Headers = new Headers();
  [key: string]: any;
}

/**
 * This should work as ESM static Module e.g. import sameInstance
 * see: (https://stackoverflow.com/a/62352866)
 */
const BevorAPI = new APIPackage();

export default BevorAPI;
