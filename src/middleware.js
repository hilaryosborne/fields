import type { BluePrint, FieldEvent } from './index';
import validator from 'validatorjs';
export type FieldRole<V> = string | ((field: BluePrint<V>) => string);
export type FieldScope<V> = string | ((field: BluePrint<V>) => string);

export type DenyFor<V> = (
  role: FieldRole<*>,
  ...scope: FieldScope<*>[]
) => (event: FieldEvent, field: BluePrint<*>) => BluePrint<*>;

export const denyFor: DenyFor = (role, ...scope) => (event, field) => {
  if (event.event !== 'APPLY_POLICIES') {
    return field;
  }
  console.log('YAY');
  return field;
};

export type AllowFor<V> = (
  role: FieldRole<*>,
  ...scope: FieldScope<*>[]
) => (event: FieldEvent, field: BluePrint<*>) => BluePrint<*>;

export const allowFor: AllowFor = (role, ...scope) => (event, field) => {
  if (event.event !== 'APPLY_POLICIES') {
    return field;
  }
  console.log('YAY');
  return field;
};

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
