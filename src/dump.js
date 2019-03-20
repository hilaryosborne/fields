import { simpleValidator } from './validation';

import type {BluePrint, FieldRole, FieldSchema, FieldScope} from "./index";

export type FieldRole<V> = string | ((field: BluePrint<V>) => string);

export type FieldScope<V> = string | ((field: BluePrint<V>) => string);

export type SetValidate<V> = (...validators: Array<(*) => BluePrint<V>>) => BluePrint<V>;

export type SetValidated<V> = (result: null | boolean, messages: string[]) => BluePrint<V>;

export type SetSanitize<V> = (...sanitizers: Array<(*) => BluePrint<V>>) => BluePrint<V>;

export type SetAllow<V> = (role: FieldRole<V>, ...scope: FieldScope<V>[]) => BluePrint<V>;

export type SetDeny<V> = (role: FieldRole<V>, ...scope: FieldScope<V>[]) => BluePrint<V>;

type IsAllowedSync = (field: BluePrint<*>, roles: FieldRole<*>[], scope: FieldScope<*>[]) => boolean;

type IsDeniedSync = (field: BluePrint<*>, roles: FieldRole<*>[], scope: FieldScope<*>[]) => boolean;

type PopulateSync = (
  schema: FieldSchema,
  data: { [string]: mixed },
  roles: FieldRole<*>[],
  scope: FieldScope<*>[],
) => FieldSchema;

const populateSync: PopulateSync = (schema, data, roles, scope) =>
  schema.map(field => {
    // This is nice but what about fields?
    // Should we also store the value for parents
    return { ...field }.trigger('SET_VALUE', data[field.code]);
  }, []);

const isAllowedSync: IsAllowedSync = (field, roles, scope) => {
  const calcRoles = roles.map(role => (typeof role === 'function' ? role(field) : role));
  const calcScope = scope.map(scope => (typeof scope === 'function' ? scope(field) : scope));
  return field.attributes.allow.length === 0
    ? true
    : field.attributes.allow.reduce((curr, [role, scope]) => {
      const fieldRole = typeof role === 'function' ? role(field) : role;
      const fieldScope = scope.map(scope => (typeof scope === 'function' ? scope(field) : scope));
      if (fieldRole.indexOf('*') > -1 && fieldScope.indexOf('*') > -1) {
        return true;
      } else if (fieldRole.indexOf('*') > -1 && fieldScope.some(scope => calcScope.indexOf(scope) > -1)) {
        return true;
      } else if (calcRoles.indexOf(fieldRole) > -1 && fieldScope.some(scope => calcScope.indexOf(scope) > -1)) {
        return true;
      } else {
        return curr;
      }
    }, false);
};

const isDeniedSync: IsDeniedSync = (field, roles, scope) => {
  const calcRoles = roles.map(role => (typeof role === 'function' ? role(field) : role));
  const calcScope = scope.map(scope => (typeof scope === 'function' ? scope(field) : scope));
  return field.attributes.deny.length === 0
    ? false
    : field.attributes.deny.reduce((curr, [role, scope]) => {
      const fieldRole = typeof role === 'function' ? role(field) : role;
      const fieldScope = scope.map(scope => (typeof scope === 'function' ? scope(field) : scope));
      if (fieldRole.indexOf('*') > -1 && fieldScope.indexOf('*') > -1) {
        return true;
      } else if (fieldRole.indexOf('*') > -1 && fieldScope.some(scope => calcScope.indexOf(scope) > -1)) {
        return true;
      } else if (calcRoles.indexOf(fieldRole) > -1 && fieldScope.some(scope => calcScope.indexOf(scope) > -1)) {
        return true;
      } else {
        return curr;
      }
    }, false);
};
