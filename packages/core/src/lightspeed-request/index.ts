import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
export * as XSeriesAPI from "./index";

export class XSeriesRequest {
  // Only methods within this class can access this variables
  static GET = "GET";
  static PUT = "PUT";
  static POST = "POST";
  static DELETE = "DELETE";

  private ax = axios.create();
  constructor(subdomain: string, AUTH_TOKEN: string) {
    if (!subdomain) {
      throw new Error("LSRetail was initialized with no subdomain");
    }
    if (!AUTH_TOKEN) {
      throw new Error("XSeriesAPI was initialized with no authorization token");
    }

    // Initiate all default request configurations
    this.ax.defaults.baseURL = `https://${subdomain}.retail.lightspeed.app`;
    this.ax.defaults.timeout = 20000;
    this.ax.defaults.headers.common["Authorization"] = `Bearer ${AUTH_TOKEN}`;
    this.ax.defaults.headers.common["Accept"] = "application/json";
  }

  static logResponse(endpoint: string, response: any) {
    console.log(`response for request to ${endpoint}`);
    console.log(`response status: ${response.status}`);
    console.log(`status text: ${response.statusText}`);
    // console.log(response.data);
  }

  async makeRequest(endpoint: string, method: string, body: any, config: any) {
    // default request configuration, no parameters or body passed

    const requestConfig: AxiosRequestConfig = {
      url: endpoint,
      method,
    };
    // if a request body is needed for PUT or POST
    requestConfig.data = body ? body : null;

    // if extra configurations are passed; parameters, pagination, etc
    requestConfig.params = config ? config : null;

    console.log(
      `Making axios request to ${this.ax.defaults.baseURL}/${endpoint}`,
    );

    const res = await this.ax.request(requestConfig).catch((e) => {
      console.error(e.message);
    });

    if (res) {
      return { data: res.data, status: res.status, headers: res.headers };
    }
  }
  // Available methods:
  // getRetailer()

  // async getRetailer() {
  //   // console.log('Getting retailer');
  //   const apiVersion = "/2.0";
  //   const endpoint = `api${apiVersion}/retailer`;
  //   const response = await this.makeRequest(endpoint, XSeriesAPI.GET);
  //   // XSeriesAPI.logResponse(endpoint, response);
  //   return response;
  // }

  // getProducts() parameters not required, defaults will apply
  // If you pass parameters you must pass the api version as a single integer first (e.g. 2 or 3), then the following
  // in this order: 'page_size (200 by default), 'deleted' boolean (false by default), 'after' version number, 'before' version number
  // EXAMPLE: account.getProducts(2, 10, false, 21250351124);
  // async getProducts(api = 2, pageSize = 200, deleted = false, after, before) {
  //   console.log("Getting Products");
  //   const endpoint = `api/${api}.0/products`;
  //   const params = {
  //     page_size: pageSize,
  //     deleted,
  //     after,
  //     before,
  //   };
  //   const response = await this.makeRequest(
  //     endpoint,
  //     XSeriesAPI.GET,
  //     null,
  //     params,
  //   );
  //   XSeriesAPI.logResponse(endpoint, response);
  //   return response.data;
  // }
  //
  // async getProductById(api = 2, id) {
  //   console.log(`Getting product with id ${id}`);
  //   const endpoint = `api/${api}.0/products/${id}`;
  //
  //   const response = await this.makeRequest(endpoint, XSeriesAPI.GET);
  //   XSeriesAPI.logResponse(endpoint, response);
  //   return response.data;
  // }
}
