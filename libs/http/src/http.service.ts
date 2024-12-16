import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { MetricsService, PerformanceProfiler } from '@multiversx/sdk-nestjs-monitoring';

@Injectable()
export class HttpService {
  private axiosInstance: AxiosInstance;

  constructor(
    private readonly metricsService: MetricsService,
  ) {
    this.setup();
  }

  private setup() {
    this.axiosInstance = axios.create();
  }

  async get<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const profiler = new PerformanceProfiler();
    const apiConfig = this.configWithURL(config);
    try {
      return await this.axiosInstance.get<T, R>(url, apiConfig);
    } finally {
      const host = HttpService.getHostname(<string>apiConfig.baseURL);
      this.metricsService.setExternalCall(host, profiler.stop());
    }
  }

  async post<TIn, T, R = AxiosResponse<T>>(
    url: string,
    data?: TIn,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const profiler = new PerformanceProfiler();
    const apiConfig = this.configWithURL(config);
    try {
      return await this.axiosInstance.post<T, R>(url, data, apiConfig);
    } finally {
      const host = HttpService.getHostname(<string>apiConfig.baseURL);
      this.metricsService.setExternalCall(host, profiler.stop());
    }
  }

  async put<TIn, T, R = AxiosResponse<T>>(
    url: string,
    data?: TIn,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const profiler = new PerformanceProfiler();
    const apiConfig = this.configWithURL(config);
    try {
      return await this.axiosInstance.put<T, R>(url, data, apiConfig);
    } finally {
      const host = HttpService.getHostname(<string>apiConfig.baseURL);
      this.metricsService.setExternalCall(host, profiler.stop());
    }
  }

  async delete<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const profiler = new PerformanceProfiler();
    const apiConfig = this.configWithURL(config);
    try {
      return await this.axiosInstance.delete<T, R>(url, apiConfig);
    } finally {
      const host = HttpService.getHostname(<string>apiConfig.baseURL);
      this.metricsService.setExternalCall(host, profiler.stop());
    }
  }

  async options<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const profiler = new PerformanceProfiler();
    const apiConfig = this.configWithURL(config);
    try {
      return await this.axiosInstance.options<T, R>(url, apiConfig);
    } finally {
      const host = HttpService.getHostname(<string>apiConfig.baseURL);
      this.metricsService.setExternalCall(host, profiler.stop());
    }
  }

  async head<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const profiler = new PerformanceProfiler();
    const apiConfig = this.configWithURL(config);
    try {
      return await this.axiosInstance.head<T, R>(url, apiConfig);
    } finally {
      const host = HttpService.getHostname(<string>apiConfig.baseURL);
      this.metricsService.setExternalCall(host, profiler.stop());
    }
  }

  private configWithURL(config?: AxiosRequestConfig): AxiosRequestConfig {
    const baseURL = config?.baseURL;
    return {
      ...config,
      baseURL,
      timeout: 5000,
    };
  }

  private static getHostname(url: string): string {
    return new URL(url).hostname;
  }
}
