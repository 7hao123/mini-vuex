import { forEachValue } from "../utils";
export default class Module {
  constructor(rawModule) {
    this._raw = rawModule;
    this.state = rawModule.state;
    this.namespaced = rawModule.namespaced;
    this._children = {};
  }
  addChild(key, module) {
    this._children[key] = module;
  }
  getChild(key) {
    return this._children[key];
  }
  forEachChild(callback) {
    forEachValue(this._children, callback);
  }
  forEachGetter(callback) {
    if (this._raw.getters) {
      forEachValue(this._raw.getters, callback);
    }
  }
  forEachMutation(callback) {
    if (this._raw.mutations) {
      forEachValue(this._raw.mutations, callback);
    }
  }
  forEachAction(callback) {
    if (this._raw.actions) {
      forEachValue(this._raw.actions, callback);
    }
  }
}
