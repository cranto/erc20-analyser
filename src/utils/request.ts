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
 *
 */
export const Queue = () => {
  return null;
};
