import { request } from "../utils/request";
const baseURL = "/api/v1/swaggerGroup";

export function fetchSwaggerGroupList() {
  return request<any[]>({
    method: "post",
    url: "/findAll",
    baseURL,
  });
}

export function addSwaggerGroup(data: { name: string }) {
  return request<any[]>({
    method: "post",
    url: "/add",
    data,
    baseURL,
  });
}
