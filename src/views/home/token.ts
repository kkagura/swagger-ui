import { InjectionKey, Ref } from "vue";
import Swagger from ".";

export const swaggerContextKey: InjectionKey<Ref<Swagger | undefined>> = Symbol(
  "swagger-base-url-key"
);
