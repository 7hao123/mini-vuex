import { inject } from "vue";
export const storeKey = "my-vuex-store";

export function useStore(injectKey) {
  return inject(injectKey || storeKey);
}
