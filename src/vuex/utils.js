export function forEachValue(obj, callback) {
  Object.keys(obj).forEach((key) => callback(obj[key], key));
}

export function isPromise(val) {
  return val && typeof val.then === "function";
}
