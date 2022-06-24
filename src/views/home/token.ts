import { InjectionKey, Ref } from "vue";

export const swaggerBaseUrlKey: InjectionKey<Ref<string>> = Symbol(
  "swagger-base-url-key"
);
