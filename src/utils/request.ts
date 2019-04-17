import axios from 'axios';
import ThrowError from './throw-error';

interface IAsyncReq {
  api: string;
  path?: string;
}

async function asyncGetRequest(props: IAsyncReq) {
  try {
    const response = await axios.get(props.api + props.path);

    return response;
  } catch (error) {
    ThrowError(error);
  }
}

/**
 *
 * @param api
 * @param path
 * @returns Promise
 */
export const request = (api: string, path?: string) => {
  return asyncGetRequest({ api, path });
};
