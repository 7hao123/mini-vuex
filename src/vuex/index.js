import { inject, reactive } from "vue";
const storeKey = "my-vuex-store";
export function forEachValue(obj, callback) {
  Object.keys(obj).forEach((key) => callback(obj[key], key));
}

class Store {
  constructor(options) {
    const store = this;
    store._state = reactive({ data: options.state || {} });
    // 包一个data  处理repaleceState方法

    const _getters = options.getters;
    store.getters = {};
    forEachValue(_getters, (fn, key) => {
      Object.defineProperty(store.getters, key, {
        get() {
          return fn(store.state);
        },
      });
    });

    store._mutations = Object.create(null);
    store._actions = Object.create(null);
    const _mutations = options.mutations || {};
    const _actions = options.actions || {};
    forEachValue(_mutations, (fn, key) => {
      store._mutations[key] = (payload) => fn.call(store, store.state, payload);
    });
    forEachValue(_actions, (fn, key) => {
      store._actions[key] = (payload) => fn.call(store, store, payload);
    });
  }
  get state() {
    return this._state.data;
  }
  commit = (type, payload) => {
    const entry = this._mutations[type];
    if (entry) {
      entry(payload);
    }
  };
  dispatch = (type, payload) => {
    const entry = this._actions[type];
    if (entry) {
      entry(payload);
    }
  };

  install(app, injectKey) {
    app.provide(injectKey || storeKey, this);
    app.config.globalProperties.$store = this;
  }
}
export function createStore(options) {
  return new Store(options);
}

export function useStore(injectKey) {
  return inject(injectKey || storeKey);
}
