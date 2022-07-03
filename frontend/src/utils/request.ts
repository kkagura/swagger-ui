import axios, { AxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";

const instance = axios.create();

class RequestError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return instance.request<T>(config).then((response: any) => {
    const { code, data, message } = response.data;
    if (code == 0) {
      return data;
    }
    ElMessage.error(message);
    return Promise.reject(new RequestError(message, code));
  });
}
