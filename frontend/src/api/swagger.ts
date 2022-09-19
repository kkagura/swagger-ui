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
  groupId: string;
}

export function fetchSwaggerList(data: any) {
  return request<PageResult<SwaggerRecord>>({
    method: "post",
    url: "/list",
    baseURL,
    data,
  });
}

export function deleteSwaggerRecord(data: any) {
  return request<PageResult<SwaggerRecord>>({
    method: "post",
    url: "/delete",
    baseURL,
    data,
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

export function updateSwaggerConfig(data: SwaggerRecord) {
  return request<any[]>({
    method: "post",
    url: "/update",
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

export function getSwaggerDetail(id: string) {
  return request<SwaggerRecord>({
    method: "post",
    url: "/get",
    baseURL,
    data: { id },
  });
}
