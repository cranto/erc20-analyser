import axios from 'axios';

/**
 *
 * @param api
 * @param path
 * @returns Promise
 */
export const Request = (api: string, path?: string): Promise<any> => {
  return axios.get(api + path);
};

/**
 *
 */
export const Queue = () => {
  return null;
};
