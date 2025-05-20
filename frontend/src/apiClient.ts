import axios from "axios";
import type { AxiosRequestConfig } from "axios";

import { API_URL } from "./config-global";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = (config?: AxiosRequestConfig) =>
    api.get<T[]>(`${this.endpoint}/`, config).then((res) => res.data);

  get = async (id: number, config?: AxiosRequestConfig) => {
    const res = await api.get<T>(`${this.endpoint}/${id}/`, config);
    return res.data;
  };

  getAllById = async (id: number, config?: AxiosRequestConfig) => {
    const res = await api.get<T[]>(`${this.endpoint}/${id}/`, config);
    return res.data;
  };

  getByUsername = async (username: string, config?: AxiosRequestConfig) => {
    const res = await api.get<T>(`${this.endpoint}/${username}/`, config);
    return res.data;
  };

  getSingle = async (config?: AxiosRequestConfig) => {
    const res = await api.get<T>(`${this.endpoint}/`, config);
    return res.data;
  };

  getFiltered = async (
    params?: { filter_id?: number; start_date?: Date; end_date?: Date },
    config?: AxiosRequestConfig
  ) => {
    const queryParams: Record<string, string | number> = {};

    if (params && typeof params.filter_id === "number") {
      queryParams.project_id = params.filter_id;
    }

    if (params && params.start_date) {
      queryParams.start_date = params.start_date.toISOString();
    }

    if (params && params.end_date) {
      queryParams.end_date = params.end_date.toISOString();
    }

    const res = await api.get<T[]>(this.endpoint, {
      ...config,
      params: queryParams,
    });
    return res.data;
  };

  // For POST, request is TReq, response is TRes (default to TReq)
  post = <TReq, TRes = TReq>(
    data: TReq,
    config?: AxiosRequestConfig
  ): Promise<TRes> =>
    api.post<TRes>(`${this.endpoint}/`, data, config).then((res) => res.data);

  // For PUT, same idea
  put = <TReq, TRes = TReq>(
    id: number,
    data: TReq,
    config?: AxiosRequestConfig
  ): Promise<TRes> =>
    api
      .put<TRes>(`${this.endpoint}/${id}/`, data, config)
      .then((res) => res.data);

  // For PATCH, request and response types can differ
  patch = <TReq, TRes = TReq>(
    id: number,
    data: TReq,
    config?: AxiosRequestConfig
  ): Promise<TRes> =>
    api
      .patch<TRes>(`${this.endpoint}/${id}/`, data, config)
      .then((res) => res.data);

  // For DELETE, usually response is something like { success: boolean } or the deleted object
  delete = <TRes>(id: number, config?: AxiosRequestConfig): Promise<TRes> =>
    api.delete<TRes>(`${this.endpoint}/${id}/`, config).then((res) => res.data);
}

export default api;
