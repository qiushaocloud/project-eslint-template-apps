/** 是否是普通对象 */
export const isPlainObject = (obj) => {
  return typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]';
}

export const deepAssign = (target, ...sources) => {
  if (!isPlainObject(target) || !sources.length) return target;
  const source = sources.shift();
  if (!isPlainObject(source)) return deepAssign(target, ...sources);

  for (const key in source) {
    const sourceVal = source[key];
    const targetVal = target[key];

    if (isPlainObject(sourceVal) && isPlainObject(targetVal)) {
      deepAssign(targetVal, sourceVal);
    } else if (sourceVal !== targetVal) {
      target[key] = sourceVal;
    }
  }

  return deepAssign(target, ...sources);
}

export const deepCopy = (obj, isUseRecursive) => {
  if (!(Array.isArray(obj) || isPlainObject(obj)))
    return obj;

  if (isUseRecursive) {
    const newObj = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const val = obj[key];
      if (Array.isArray(obj) || isPlainObject(obj))
        newObj[key] = deepCopy(val, isUseRecursive);
      else
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        newObj[key] = val;
    }

    return newObj;
  }

  return JSON.parse(JSON.stringify(obj));
}