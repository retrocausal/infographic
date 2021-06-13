Function.prototype.is = function (parent) {
  const child = this;
  const prototype = Object.create(parent.prototype);
  prototype.constructor = child;
  prototype.parent = Object.getPrototypeOf(prototype);
  child.super = parent.prototype.constructor;
  child.prototype = prototype;
};
