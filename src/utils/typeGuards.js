export const isPlainObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};
