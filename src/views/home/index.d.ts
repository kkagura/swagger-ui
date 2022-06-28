type VALUE_TYPE_PRIMITIVE = "string" | "integer";
type VALUE_TYPE =
  | "array"
  | "boolean"
  | "integer"
  | "number"
  | "object"
  | "string"
  | "double"
  | "float"
  | "long";
type VALUE_FORMAT = "int64" | "int32";
export interface ObjectScheme {
  title?: string;
  description?: string;
  type?: VALUE_TYPE;
  enum?: string[];
  format?: VALUE_FORMAT;
  properties?: {
    [key: string]: ObjectScheme;
  };
  items?: ObjectScheme;
  $ref?: string;
}
export type Parameter = {
  name: string;
  in: "path" | "body" | "query" | "formData" | "header";
  required?: boolean;
  description?: string;
  type?: VALUE_TYPE_PRIMITIVE;
  format?: VALUE_FORMAT;
  schema: ObjectScheme;
};

interface Response {
  description: string;
  schema: ObjectScheme;
}

export interface SwaggerRequest {
  summary: string;
  description?: string;
  operationId: string;
  responses: Record<string, Response>;
  parameters: Array<Parameter>;
  tags: string[];
}

export interface SwaggerPath {
  get?: SwaggerRequest;
  post?: SwaggerRequest;
  put?: SwaggerRequest;
  delete?: SwaggerRequest;
}

export interface RequestMenu {
  name: string;
  path: string;
  method: string;
  key: string;
}

export interface TagGroupItem {
  name: string;
  description: string;
  children: PathItem[];
}

export interface ParamRow {
  name: string;
  description: string;
  requestType?: string;
  required?: boolean;
  dataType: string;
  schemaType?: string;
  children?: ParamRow[];
}

export interface ResponeseStatusRow {
  status: string;
  description: string;
  schemaType: string;
}
export default interface Swagger {
  swagger: "2.0" | "3.0";
  basePath?: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: {
    [path: string]: SwaggerPath;
  };
  definitions: {
    [definition: string]: ObjectScheme;
  };
  tags: { name: string; description: string }[];
}
