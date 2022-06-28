import Swagger, {
  TagGroupItem,
  SwaggerPath,
  SwaggerRequest,
  ResponeseStatusRow,
  ParamRow,
  ObjectScheme,
} from ".";
import { convertRefKey } from "./swagger";

const ID_KEY = "___";
const FEIGN_KEY = "feign";

export function createMenus(swagger: Swagger): TagGroupItem[] {
  const map: Record<string, TagGroupItem> = {};
  swagger.tags.forEach((tag) => {
    //  剔除feign接口
    if (!new RegExp(FEIGN_KEY, "g").test(tag.name)) {
      map[tag.name] = {
        ...tag,
        children: [],
      };
    } else {
      console.log(tag.name);
    }
  });
  Object.keys(swagger.paths).forEach((path) => {
    Object.keys(swagger.paths[path]).forEach((method) => {
      const swaggerRequest = swagger.paths[path][method as keyof SwaggerPath];
      if (swaggerRequest) {
        const { summary, tags } = swaggerRequest;
        const pathItem = {
          name: summary,
          method,
          path,
          key: joinPathId(path, method),
        };
        tags.forEach((tagName) => {
          map[tagName]?.children.push(pathItem);
        });
      }
    });
  });
  return Object.values(map);
}

export function joinPathId(path: string, method: string) {
  return `${path}${ID_KEY}${method}`;
}

export function splitPathId(key: string): [string, keyof SwaggerPath] {
  return key.split(ID_KEY) as [string, keyof SwaggerPath];
}

export function filterMenu(menu: TagGroupItem[], key: string): TagGroupItem[] {
  if (!key) {
    return menu;
  }
  const result: TagGroupItem[] = [];
  menu.forEach((item) => {
    if (item.name.includes(key)) {
      result.push(item);
    } else {
      const { children } = item;
      if (
        children.some(
          (child) => child.name.includes(key) || child.path.includes(key)
        )
      ) {
        result.push(item);
      }
    }
  });
  return result;
}

export function createResponseStatusData(requestData: SwaggerRequest) {
  const data: ResponeseStatusRow[] = [];
  Object.keys(requestData.responses).forEach((status) => {
    const { description, schema } = requestData.responses[status];
    let schemaType = "";
    if (schema) {
      schemaType = (schema.$ref && convertRefKey(schema.$ref)) || "";
    }
    data.push({
      description,
      schemaType,
      status,
    });
  });
  return data;
}

export function createResponseParamsData(
  requestData: SwaggerRequest,
  swagger: Swagger
) {
  const data: ParamRow[] = [];
  const response = requestData.responses["200"];
  data.push(...expandSchema(response.schema, swagger));
  console.log(data);
  return data;
}

export function expandSchema(
  schema: ObjectScheme,
  swagger: Swagger,
  refStack: string[] = []
) {
  const data: ParamRow[] = [];
  if (schema.properties) {
    Object.entries(schema.properties).forEach(([key, value]) => {
      const row: ParamRow = {
        name: key,
        description: value.description ?? "",
        dataType: value.type ?? (value.$ref && convertRefKey(value.$ref)) ?? "",
        schemaType: (value.$ref && convertRefKey(value.$ref)) ?? "",
      };
      if (value.$ref) {
        const schemaType = convertRefKey(value.$ref);
        if (!refStack.includes(schemaType)) {
          refStack.push(schemaType);
          row.children = expandSchema(
            swagger.definitions[convertRefKey(value.$ref)],
            swagger,
            refStack
          );
        }
      } else if (value.type === "object") {
        row.children = expandSchema(value, swagger, refStack);
      } else if (value.type === "array") {
        row.children = expandSchema(
          value.items as ObjectScheme,
          swagger,
          refStack
        );
      }
      data.push(row);
    });
  } else if (schema.$ref) {
    const schemaType = convertRefKey(schema.$ref);
    if (!refStack.includes(schemaType)) {
      refStack.push(schemaType);
      const obj = swagger.definitions[schemaType];
      data.push(...expandSchema(obj, swagger, refStack));
    }
  }
  return data;
}
