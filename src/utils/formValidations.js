export const notEmpty = val => !!val || 'Ingresá algún valor';

export const validVariable = val => /^[[a-zA-Z_]+\w*$/.test(val) || 'Formato incorrecto';

export const unique = (val, existingVals = []) => {
  return !existingVals.includes(val) || 'Este valor ya existe';
};
