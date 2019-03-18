// @flow

import validator from 'validatorjs';
import type { BluePrint } from './index';

type SimpleValidator = (...rules: string[]) => (field: BluePrint<*>) => BluePrint<*>;

export const simpleValidator: SimpleValidator = (...rules) => field => {
  const validation = new validator({ value: field.attributes.value }, { value: rules.join('|') });
  return { ...field }.validated(validation.passes(), validation.passes() ? [] : validation.errors.get('value'));
};
