import axios from 'axios';
import { ThrowError } from './';

/**
 *
 * @param api
 * @param path
 * @returns Promise
 */
export const Request = (api: string, path?: string): Promise<any> => {
  return axios.get(api + path);
};

export const WrapperRequest = (url: string) => {
  const response = async () => {
    try {
      const data = await Request(url);

      return data;
    } catch (error) {
      ThrowError(error);
    }
  };

  return response();
};

/**
 * Promise Queue for third party APIs
 * @returns {Promise}
 */
export const PromiseQueue = (
  data: any[],
  fn: { (value: any): Promise<any>; (i: any): Promise<{ [x: number]: any }>; (arg0: any): void },
  delayMS: number,
): Promise<any> => {
  const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));

  const delayedMap = async (arr: any, callback: { (value: any): Promise<any>; (arg0: any): void }, delayTime: any) => {
    let promises = [];

    for (const item of arr) {
      await delay(delayTime);
      promises.push(await callback(item));
    }

    return Promise.all(promises);
  };

  const toList = async (value: any) => {
    let data = await fn(value);

    return data;
  };

  const delayTime = delayMS;

  return delayedMap(data, toList, delayTime);
};
