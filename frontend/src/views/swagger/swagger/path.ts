import { transformSchemaObj } from "./def";
import Swagger, { SwaggerPath, SwaggerRequest } from "..";
import { convertRefKey, nodeType } from "./utils";

export function convertPath(swagger: Swagger, path: SwaggerPath, url: string) {
  let codes = "\n\n";
  Object.keys(path).forEach((method) => {
    const swaggerRequest = path[method as keyof SwaggerPath];
    if (!swaggerRequest) {
      return;
    }
    const res = convertRequest(swagger, swaggerRequest, method, url);
    codes += res;
  });
  return codes;
}

function convertRequest(
  swagger: Swagger,
  request: SwaggerRequest,
  method: string,
  url: string
) {
  const { operationId, parameters = [], summary, responses } = request;
  const rep = responses["200"];
  let returnType = "";
  if (rep.schema?.$ref) {
    const key = convertRefKey(rep.schema?.$ref);
    const obj = swagger.definitions[key];
    const type = nodeType(obj);
    if (["string", "number", "boolean", "unknown", "any"].includes(type)) {
      returnType = transformSchemaObj(obj);
    } else if (type === "array" && obj.items) {
      const itemType = nodeType(obj.items);
      if (
        ["string", "number", "boolean", "unknown", "any"].includes(itemType)
      ) {
        returnType = `${itemType}[]`;
      } else {
        returnType = transformSchemaObj(rep.schema);
      }
    } else {
      returnType = transformSchemaObj(rep.schema || rep);
    }
  } else {
    returnType = transformSchemaObj(rep.schema || rep);
  }
  const returnStr = rep.schema?.$ref ? `<${returnType}>` : "";
  const { comments, params } = convertParams(parameters);
  let bodyData: string[] = [];
  bodyData.push(`url: '${url}'`);
  bodyData.push(`method: '${method}'`);
  bodyData.push("baseURL");
  const queryParameters = parameters
    .filter((p) => p.in === "query")
    .map((p) => p.name);
  if (queryParameters.length > 0) {
    bodyData.push(`params: {${queryParameters.join(", ")}}`);
  }
  const dataParameters = parameters
    .filter((p) => p.in === "formData" || p.in === "body")
    .map((p) => p.name);
  if (dataParameters.length == 1) {
    bodyData.push("data:" + dataParameters[0]);
  } else if (dataParameters.length) {
    bodyData.push(`data: {${dataParameters.join(", ")}}`);
  }
  bodyData = bodyData.map((value, index, array) => {
    return index == array.length - 1 ? value : value + ",";
  });

  const codes: string[] = [`export function ${operationId}(${params}) {`];
  codes.push(`return XHR${returnStr}({`);
  codes.push(...bodyData);
  codes.push("})");
  codes.push("}");
  const res = `/**
  * ${summary}
  ${comments}
  */
 ${codes.join("\n")}`;
  return res;
}

function convertParams(params: SwaggerRequest["parameters"]) {
  if (!params) {
    return {
      ps: "",
      cs: "",
    };
  }
  let ps = "";
  let cs = "";
  for (let i = 0; i < params.length; i++) {
    if (params[i].in === "header") {
      continue;
    }
    const p = params[i].name;
    const type = transformSchemaObj(params[i].schema || params[i]);
    ps += `,${p}: ${type}`;
    cs += `\n * @param ${p} ${params[i].description || ""}`;
  }
  ps = ps.substring(1);
  cs = cs.substring(1);
  return {
    params: ps,
    comments: cs,
  };
}
