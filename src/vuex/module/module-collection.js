import Module from "./module";
import { forEachValue } from "../utils";
export default class ModuleCollection {
  constructor(rootModule) {
    this.root = null;
    this.register(rootModule, []);
  }

  get(path) {
    return path.reduce((module, key) => {
      return module.getChild(key);
    }, this.root);
  }

  register(rawModule, path) {
    if (path.length === 0) {
      this.root = new Module(rawModule);
    } else {
      const parent = this.get(path.slice(0, -1));
      const newModule = new Module(rawModule);
      parent.addChild(path[path.length - 1], newModule);
    }
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(rawChildModule, path.concat(key));
      });
    }
    console.log(this.root, path);
  }
  getNamespaced(path) {
    let module = this.root;
    return path.reduce((namespace, key) => {
      module = module.getChild(key);
      return namespace + (module.namespaced ? key + "/" : "");
    }, "");
  }
}
