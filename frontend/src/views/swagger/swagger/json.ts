import Swagger, { ObjectScheme } from "../";
import { convertRefKey } from "./utils.js";

export default function convertJsonObjectType(
  swagger: Swagger,
  key: string,
  value: ObjectScheme,
  stack: string[] = []
): any {
  if (!value) {
    return undefined;
  }
  if (value.type === "string") {
    if (value.enum) {
      return value.enum[0];
    }
    return "";
  } else if (
    value.type === "integer" ||
    value.type == "number" ||
    value.type == "float" ||
    value.type == "double" ||
    value.type == "long"
  ) {
    return 0;
  } else if (value.type == "boolean") {
    return false;
  } else if (value.type === "array") {
    return [convertJsonObjectType(swagger, key, value.items!, stack)].filter(
      (item) => item !== undefined
    );
  } else if (value.$ref) {
    if (stack.includes(value.$ref)) {
      return undefined;
    }
    stack.push(value.$ref);
    return convertJsonObjectType(
      swagger,
      key,
      swagger.definitions[convertRefKey(value.$ref)],
      stack
    );
  } else if (value.type === "object" || value.properties) {
    const typeObject: any = {};
    Object.keys(value.properties || []).forEach((key) => {
      let objKey = key;
      const objValue = convertJsonObjectType(
        swagger,
        key,
        value.properties![key],
        stack
      );
      typeObject[objKey] = objValue;
    });
    return typeObject;
  }
  return undefined;
}
