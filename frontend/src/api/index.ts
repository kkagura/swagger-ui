import swagger from "../example/swagger.json";
import Swagger from "../views/swagger";

export function fetchSwagger(url: string): Promise<Swagger> {
  return Promise.resolve(swagger as unknown as Swagger);
}
