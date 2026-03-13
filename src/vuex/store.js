import ModuleCollection from "./module/module-collection";
import { storeKey } from "./injectKey";
import { isPromise } from "./utils";
import { reactive } from "vue";
import { forEachValue } from "./utils";

function resetStoreState(store, state) {
  store._state = reactive({ data: state });
  const wrappedGetters = store._wrapGetters;
  store.getters = {};
  // 为什么要object.defineProperty，为了每次getter都触发
  forEachValue(wrappedGetters, (fn, key) => {
    Object.defineProperty(store.getters, key, {
      get: fn,
    });
  });
}

export class Store {
  constructor(options) {
    // 对module形成树结构
    const store = this;
    this._modules = new ModuleCollection(options);
    console.log("this._modules", this._modules);
    store._wrapGetters = Object.create(null);
    store._mutations = Object.create(null);
    store._actions = Object.create(null);

    const state = this._modules.root.state;
    // state形成树结构
    installModule(this, state, [], this._modules.root);
    resetStoreState(this, state);
    console.log("state", state);
    // console.log("store", store);
  }
  get state() {
    return this._state.data;
  }

  commit = (type, payload) => {
    const entry = this._mutations[type];
    if (!entry) {
      return;
    }
    for (let i = 0; i < entry.length; i++) {
      entry[i](payload);
    }
  };

  dispatch = (type, payload) => {
    const entry = this._actions[type];
    if (!entry) {
      return;
    }
    let result =
      entry.length > 1
        ? Promise.all(entry.map((fn) => fn(payload)))
        : entry[0](payload);
    return isPromise(result) ? result : result;
  };

  install(app, injectKey) {
    app.provide(injectKey || storeKey, this);
    app.config.globalProperties.$store = this;
  }
}

function getNestedState(state, path) {
  return path.reduce((state, key) => {
    return state[key];
  }, state);
}

function installModule(store, rootState, path, module) {
  let isRoot = !path.length;
  if (!isRoot) {
    let parentState = path.slice(0, -1).reduce((state, key) => {
      return state[key];
    }, rootState);
    parentState[path[path.length - 1]] = module.state;
  }
  module.forEachGetter((getter, key) => {
    store._wrapGetters[key] = function () {
      return getter(getNestedState(store.state, path));
    };
  });

  module.forEachMutation((mutation, key) => {
    const entry = store._mutations[key] || (store._mutations[key] = []);
    entry.push(function (payload) {
      mutation.call(store, getNestedState(store.state, path), payload);
    });
  });

  module.forEachAction((action, key) => {
    const entry = store._actions[key] || (store._actions[key] = []);
    entry.push(function (payload) {
      let res = action.call(store, store, payload);
      if (!isPromise(res)) {
        return Promise.resolve(res);
      }
      return res;
    });
  });

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child);
  });
}
