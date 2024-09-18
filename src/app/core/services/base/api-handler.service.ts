import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {IApiBaseActions, ParamsType} from './api-base-actions.interface';
import {ApiBaseResponse} from '../../../shared/interfaces/api-base-response.interface';

/**
 * Use ApiHandlerService class to perform all http requests from app
 */
@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService implements IApiBaseActions {
  constructor(public httpClient: HttpClient) {
  }


  /**
   * GET request to an api url
   * @param url a valid http request url
   * @param [params] Config params for http request
   * @returns  observable to the response
   */
  Get(url: string, params?: ParamsType | any) {
    return this.httpClient.get<ApiBaseResponse>(url, {params: this.createParams(params)});
  }

  /**
   * Post request to an api call
   * @param url a valid http request url
   * @param data data to pass to the request body
   * @param [params] Config params for http request
   * @param [headers] headers to pass to the http request
   * @returns  observable to the response
   */
  Post(url: string, data: any, params?: ParamsType, headers?: any) {
    return this.httpClient.post<ApiBaseResponse>(url, data, {params: this.createParams(params), headers: headers});
  }


  /**
   * Delete request to an api url
   * @param url a valid http request url
   * @param [params] Config params for http request
   * @returns  observable to the response
   */
  Delete(url: string, params?: ParamsType) {
    return this.httpClient.delete<ApiBaseResponse>(url, {params: this.createParams(params)});
  }


  /**
   * Put request to an api url
   * @param url a valid http request url
   * @param data data to pass to the request body
   * @param [params] Config params for http request
   * @returns  observable to the response
   */
  Put(url: string, data: any, params?: ParamsType) {
    return this.httpClient.put<ApiBaseResponse>(url, data, {params: this.createParams(params)});
  }

  /**
   * Patch request to an api url
   * @param url a valid http request url
   * @param data data to pass to the request body
   * @param [params] Config params for http request
   * @returns  observable to the response
   */
  Patch(url: string, data: any, params?: ParamsType) {
    return this.httpClient.patch<ApiBaseResponse>(url, data, {params: this.createParams(params)});
  }

  /**
   * Convert app params object to http request params object
   * @param [params] Custom Config params for http request
   * @returns  A valid HTTPParams object to pass to the http request
   */
  private createParams(params?: ParamsType) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.append(key, value);
      });
    }
    return httpParams;
  }

}

