import axios from './instance';
import {AxiosBasicCredentials} from 'axios';
import ApiCode from './apiCode';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type PayloadOption = 'params' | 'data'

interface HttpRes<O> {
  data: {
    code: ApiCode
    data: O
  }
}

class AxiosAPI<I, O = never> {
  private readonly url: string
  private readonly name: string
  private readonly method: HttpMethod
  private readonly _run: (input: I, auth?: AxiosBasicCredentials) => Promise<HttpRes<O>>

  constructor(url: string, method: HttpMethod = 'GET', name?: string,
              payloadOptions?: PayloadOption | Record<PayloadOption, (keyof I)[]>
  ) {
    this.url = url;
    this.name = name ?? url;
    this.method = method;

    const payloadMap = {
      'GET': 'params',
      'POST': 'data',
      'PUT': 'data',
      'DELETE': 'data'
    };

    payloadOptions = (payloadOptions ?? payloadMap[method] as PayloadOption);

    if (typeof payloadOptions == 'string') {
      const option = payloadOptions;
      this._run = async (input: I, auth?: AxiosBasicCredentials) => {
        return await axios.request({
          url, method, auth,
          [option]: input
        });
      };
    } else {
      this._run = async (input: I, auth?: AxiosBasicCredentials) => {
        payloadOptions = payloadOptions as Record<PayloadOption, (keyof I)[]>;
        const params: Partial<I> = {}
        const data: Partial<I> = {}
        payloadOptions.params.forEach(name => params[name] = input[name]);
        payloadOptions.data.forEach(name => data[name] = input[name]);
        return await axios.request({
          url, method, auth, params, data
        });
      }
    }
  }

  async run(input: I, auth?: AxiosBasicCredentials): Promise<O> {
    const res = await this._run(input, auth);
    const data = res.data;
    if (data.code != 'Ok') {
      console.error('[API] Logic Error')
      throw data.code;
    }
    return data.data;
  }

  async debugRun(input: I, auth?: AxiosBasicCredentials): Promise<O> {
    console.log(`[API] Name: [${this.name}], Method: ${this.method}`);
    console.log('[API] Calling...')
    const res = await this.run(input, auth);
    console.log(`[API] Response:`);
    console.log(res);
    return res;
  }

}

export {
  HttpMethod, AxiosAPI
}
