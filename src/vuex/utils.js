export function forEachValue(obj, callback) {
  Object.keys(obj).forEach((key) => callback(obj[key], key));
}
