import { InjectionKey } from "vue";

export const detailContextKey: InjectionKey<{
  labelWidth: string;
  inline: boolean;
}> = Symbol("detail-context-key");
