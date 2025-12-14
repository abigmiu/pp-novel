import type { IApiResponse } from "@/types/common";
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type CreateAxiosDefaults } from "axios";
import { ClientBusinessRequestError } from "./errors";

interface IRequestConfig extends AxiosRequestConfig {
    retry?: number;
    retryDelay?: number;
}

class Request {
    private service: AxiosInstance;

    constructor(config: CreateAxiosDefaults) {
        this.service = axios.create(config);
        this.initInterceptor();
    }

    initInterceptor() {
        this.service.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            }, (error) => {
                console.error('请求错误:', error);
                return Promise.reject(error);
            })

        this.service.interceptors.response.use(
            (response: AxiosResponse<IApiResponse>) => {
                if (response.status !== 200) {
                    return Promise.reject('服务器错误');
                }

                const apiResponse = response.data;
                if (apiResponse.code !== 200) {
                    // return Promise.reject(apiResponse.message || '请求异常');
                    throw new ClientBusinessRequestError(apiResponse);
                }
                return apiResponse.data;
            }
        )
    }


    get<T = any>(url: string, params?: any, config?: IRequestConfig): Promise<T> {
        return this.service.request({
            url,
            method: 'get',
            params,
            ...config,
        })
    }

    post<T = any>(url: string, data?: any, config?: IRequestConfig): Promise<T> {
        return this.service.request({
            url,
            method: 'post',
            data,
            ...config,
        })
    }

    put<T = any>(url: string, data?: any, config?: IRequestConfig): Promise<T> {
        return this.service.request({
            url,
            method: 'put',
            data,
            ...config,
        })
    }

    delete<T = any>(url: string, config?: IRequestConfig): Promise<T> {
        return this.service.request({
            url,
            method: 'delete',
            ...config,
        })
    }

}


const axiosConfig: CreateAxiosDefaults = {
    baseURL: 'http://localhost:8080',
    timeout: 10 * 1000,
    withCredentials: true
}

export const request = new Request(axiosConfig);