import { request } from "../utils/request";
import Swagger from "../views/swagger";
const baseURL = "/api/v1/swagger";
export interface PageResult<T = any> {
  page: number;
  pageSize: number;
  total: number;
  records: T[];
}

export interface SwaggerRecord {
  name: string;
  path: string;
  tag: string;
}

export function fetchSwaggerList() {
  return request<PageResult<SwaggerRecord>>({
    method: "post",
    url: "/list",
    baseURL,
  });
}

export function addSwaggerConfig(data: SwaggerRecord) {
  return request({
    method: "post",
    url: "/add",
    baseURL,
    data,
  });
}

export function getSwaggerDoc(id: string) {
  return request<Swagger>({
    method: "post",
    url: "/getSwaggerDoc",
    baseURL,
    data: { id },
  });
}
