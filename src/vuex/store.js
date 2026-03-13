import ModuleCollection from "./module/module-collection";
import { storeKey } from "./injectKey";

export class Store {
  constructor(options) {
    // 对module形成树结构
    const store = this;
    this._modules = new ModuleCollection(options);
    console.log("this._modules", this._modules);

    const state = this._modules.root.state;
    // state形成树结构
    installModule(this, state, [], this._modules.root);
    console.log("state", state);
  }

  install(app, injectKey) {
    app.provide(injectKey || storeKey, this);
    app.config.globalProperties.$store = this;
  }
}

function installModule(store, rootState, path, module) {
  let isRoot = !path.length;
  if (!isRoot) {
    let parentState = path.slice(0, -1).reduce((state, key) => {
      return state[key];
    }, rootState);
    parentState[path[path.length - 1]] = module.state;
  }
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child);
  });
}
