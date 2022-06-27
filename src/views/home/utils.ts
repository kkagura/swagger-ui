import Swagger, { TagGroupItem, SwaggerPath } from ".";

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
      if (children.some((child) => child.name.includes(key) || child.path.includes(key))) {
        result.push(item);
      }
    }
  });
  return result;
}
