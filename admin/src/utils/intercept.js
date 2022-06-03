export const intercept = (root, key, fn) => {
    if (!(root[key] instanceof Function)) {
      throw new Error('Invald interception');
    }
    const oldFn = root[key];
    root[key] = (...args) => {
      return fn.call(this, {
        args,
        resolve: (...newArgs) => oldFn.apply(root, newArgs),
      });
    };
  };