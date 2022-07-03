import Swagger, { ObjectScheme, SwaggerPath, SwaggerRequest } from "..";
import { removeRef } from "./removeRef";
import { clearRef, setRef, getDefinitions } from "./store";
import { convertRefKey, isValidName, nodeType, upperFirst } from "./utils";
import { transformSchemaObjMap } from "./def";
import { convertPath } from "./path";

export function generate(
  swagger: Swagger,
  path: string,
  method: keyof SwaggerPath
) {
  clearRef();
  pre(swagger, path, method);
  const request = swagger.paths[path][method];
  let reqParams = "\n",
    resParams = "\n";
  if (request) {
    const req = request.parameters.find((item) => item.in === "body");
    if (req) {
      const refs = collectRefType(req.schema, swagger, []);
      const defs: Record<string, ObjectScheme> = {};
      refs.forEach((k) => {
        const def = swagger.definitions[k];
        const itemType = nodeType(def);
        if (
          !["string", "number", "boolean", "unknown", "any"].includes(itemType)
        ) {
          defs[k] = swagger.definitions[k];
        }
      });
      reqParams += transformSchemaObjMap(defs);
    }
    const res = request.responses["200"];
    if (res) {
      const refs = collectRefType(res.schema, swagger, []);
      const defs: Record<string, ObjectScheme> = {};
      refs.forEach((k) => {
        const def = swagger.definitions[k];
        const itemType = nodeType(def);
        if (
          !["string", "number", "boolean", "unknown", "any"].includes(itemType)
        ) {
          defs[k] = swagger.definitions[k];
        }
      });
      resParams += transformSchemaObjMap(defs);
    }
  }
  return {
    reqParams,
    resParams,
  };
}

function pre(swagger: Swagger, path: string, method: keyof SwaggerPath) {
  let types: string[] = [];
  swagger.paths = {
    [path]: swagger.paths[path],
  };
  swagger.paths[path] = {
    [method]: swagger.paths[path][method],
  };
  removeRef(swagger);
  Object.keys(swagger.paths).forEach((key) => {
    const path = swagger.paths[key];
    Object.keys(path).forEach((method) => {
      const request = path[method as keyof SwaggerPath];
      if (!request) {
        return;
      }
      if (method !== "get") {
        request.parameters?.forEach((p) => {
          if (
            p.in === "body" &&
            request.parameters?.filter((i) => i.in === "body").length === 1
          ) {
            if (p.schema?.$ref) {
              const ref = convertRefKey(p.schema.$ref);
              if (!isValidName(ref)) {
                setRef(ref, upperFirst(request.operationId) + "Data");
              }
            }
          }
        });
      }
      if (request.responses["200"]?.schema?.$ref) {
        const ref = convertRefKey(request.responses["200"].schema.$ref);
        if (!isValidName(ref)) {
          setRef(ref, upperFirst(request.operationId) + "Result");
        }
      }
    });
    types = types.reduce((pre, curr) => {
      if (curr && !pre.includes(curr)) {
        pre.push(curr);
      }
      return pre;
    }, [] as string[]);
    if (Object.keys(path).length === 0) {
      delete swagger.paths[key];
    }
  });
}

function collectRefType(
  value: ObjectScheme,
  swagger: Swagger,
  res: string[] = []
) {
  if (!value) return res;
  if (value.$ref) {
    const ref = convertRefKey(value.$ref);
    if (!res.includes(ref)) {
      res.push(ref);
      const def = swagger.definitions[ref];
      collectRefType(def, swagger, res);
    }
  } else if (value.type === "array") {
    res.push(...collectRefType(value.items || {}, swagger, res));
  } else if (value.additionalProperties) {
    res.push(...collectRefType(value.additionalProperties, swagger, res));
  } else if (value.type === "object" || value.properties) {
    Object.keys(value.properties || {}).forEach((key) => {
      res.push(...collectRefType(value.properties![key], swagger, res));
    });
  }
  return res.reduce((pre, curr) => {
    if (!pre.includes(curr)) {
      pre.push(curr);
    }
    return pre;
  }, [] as string[]);
}
