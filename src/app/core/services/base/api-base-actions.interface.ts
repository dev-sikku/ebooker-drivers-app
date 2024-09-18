import {Observable} from 'rxjs';
import {ApiBaseResponse} from '../../../shared/interfaces/api-base-response.interface';

/**
 * Config Params to the http request, we can extend these params object as per our needs
 */
export type ParamsType = { hideLoader?: boolean, retry?: boolean }

/**
 * base actions for http client service
 */
export interface IApiBaseActions {
  /**
   * GET request to an api url
   * @param url a valid http request url
   * @param [params] Config params for http request
   * @returns  observable to the response
   */
  Get(url: string, params?: ParamsType): Observable<ApiBaseResponse>;

  /**
   * Post request to an api call
   * @param url a valid http request url
   * @param data data to pass to the request body
   * @param [params] Config params for http request
   * @param [headers] headers to pass to the http request
   * @returns  observable to the response
   */
  Post(url: string, data: any, params?: ParamsType): Observable<ApiBaseResponse>;

  /**
   * Delete request to an api url
   * @param url a valid http request url
   * @param [params] Config params for http request
   * @returns  observable to the response
   */
  Delete(url: string, data?: any, params?: ParamsType): Observable<ApiBaseResponse>;

  /**
   * Put request to an api url
   * @param url a valid http request url
   * @param data data to pass to the request body
   * @param [params] Config params for http request
   * @returns  observable to the response
   */
  Put(url: string, data: any, params?: ParamsType): Observable<ApiBaseResponse>;

  /**
   * Patch request to an api url
   * @param url a valid http request url
   * @param data data to pass to the request body
   * @param [params] Config params for http request
   * @returns  observable to the response
   */
  Patch(url: string, data: any, params?: ParamsType): Observable<ApiBaseResponse>;
}
