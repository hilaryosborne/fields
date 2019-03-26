import type { BluePrint, FieldEvent } from './index';
import validator from 'validatorjs';
import eventMatchesPolicies from './Helpers/eventMatchesPolicies';
export type FieldRole<V> = string | ((field: BluePrint<V>) => string);
export type FieldScope<V> = string | ((field: BluePrint<V>) => string);





export type ToUpperCase = (event: FieldEvent, field: BluePrint<*>) => BluePrint<*>;

export const toUpperCase: ToUpperCase = (event, field) => field;

type SimplyValidate = (...rules: string[]) => (event: FieldEvent, field: BluePrint<*>) => BluePrint<*>;

export const simplyValidate: SimplyValidate = (...rules) => (event, field) => {
  if (event.event !== 'VALIDATE') {
    return field;
  }
  const validation = new validator({ value: field.attributes.value }, { value: rules.join('|') });
  return { ...field }.validated(validation.passes(), validation.passes() ? [] : validation.errors.get('value'));
};
