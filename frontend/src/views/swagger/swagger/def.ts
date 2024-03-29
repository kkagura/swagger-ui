import { addDefinition, getRef } from "./store.js";
import {
  convertRefKey,
  isValidName,
  nodeType,
  ParsedSimpleValue,
  parseSingleSimpleValue,
  tsUnionOf,
} from "./utils.js";

const COMMENT_RE = /\*\//g;
export const LB_RE = /\r?\n/g;

export function transformSchemaObjMap(
  objMap: Record<string, any>,
  root: boolean = true
) {
  let output = "";
  Object.entries(objMap).forEach(([k, v]) => {
    const comments = (root ? "" : "  ") + (v ? createComment(v) : "");
    output += comments;
    output += "\n";
    output += root
      ? nodeType(v) === "array"
        ? `export type ${isValidName(k) ? k : getRef(k)} = `
        : `export interface ${isValidName(k) ? k : getRef(k)} `
      : `  ${k}: `;
    output += transformSchemaObj(v, k);
    output += "\n";
  });
  return output;
}

export function transformSchemaObj(node: any, k: string = ""): string {
  let type = "";
  switch (nodeType(node)) {
    case "ref": {
      type = convertRefKey(node.$ref);
      addDefinition(type);
      if (!isValidName(type)) {
        type = getRef(type) || "unknown";
      }
      break;
    }
    case "string":
    case "number":
    case "boolean":
    case "unknown": {
      type = nodeType(node);
      break;
    }
    case "const": {
      type += parseSingleSimpleValue(node.const, node.nullable);
      break;
    }
    case "enum": {
      const items: Array<ParsedSimpleValue> = [];
      (node.enum as unknown[]).forEach((item) => {
        const value = parseSingleSimpleValue(item, node.nullable);
        items.push(value);
      });
      type = tsUnionOf(items);
      break;
    }
    case "object": {
      if (node.additionalProperties) {
        type = `{ [key: string]:  ${transformSchemaObj(
          node.additionalProperties
        )}}`;
      } else {
        type =
          "{\n" + transformSchemaObjMap(node.properties || {}, false) + "}";
      }
      break;
    }

    case "array": {
      // type = "any[]";
      if (!node.items) {
        type = "any[]";
      } else if (Array.isArray(node.items)) {
      } else {
        type = transformSchemaObj(node.items || {}) + "[]";
      }
      break;
    }
  }
  return type;
}

function createComment(v: any): string {
  const commentsArray: Array<string> = [];

  // * Not JSDOC tags: [title, format]
  if (v.title) commentsArray.push(`${v.title} `);
  if (v.format) commentsArray.push(`Format: ${v.format} `);

  // * JSDOC tags without value
  // 'Deprecated' without value
  if (v.deprecated) commentsArray.push(`@deprecated `);

  // * JSDOC tags with value
  const supportedJsDocTags = ["description", "default", "example"];
  for (let index = 0; index < supportedJsDocTags.length; index++) {
    const field = supportedJsDocTags[index];
    if (v[field]) commentsArray.push(`@${field} ${v[field]} `);
  }

  // * JSDOC 'Constant' without value
  if (v.const) commentsArray.push(`@constant `);

  // * JSDOC 'Enum' with type
  if (v.enum) {
    const canBeNull = v.nullable ? `|${null}` : "";
    commentsArray.push(`@enum {${v.type}${canBeNull}}`);
  }

  if (!commentsArray.length) return "";

  return comment(commentsArray.join("\n"));
}

export function comment(text: string): string {
  const commentText = text.trim().replace(COMMENT_RE, "*\\/");

  // if single-line comment
  if (commentText.indexOf("\n") === -1) {
    return `/** ${commentText} */`;
  }

  // if multi-line comment
  return `/**
  * ${commentText.replace(LB_RE, "\n  * ")}
  */`;
}
