// @flow

import { simpleValidator } from './validation';

export type FieldSchema = *[];

export type FieldRole<V> = string | ((field: BluePrint<V>) => string);

export type FieldScope<V> = string | ((field: BluePrint<V>) => string);

export type SetValidate<V> = (...validators: Array<(*) => BluePrint<V>>) => BluePrint<V>;

export type SetValidated<V> = (result: null | boolean, messages: string[]) => BluePrint<V>;

export type SetSanitize<V> = (...sanitizers: Array<(*) => BluePrint<V>>) => BluePrint<V>;

export type SetTag<V> = (...tags: string[]) => BluePrint<V>;

export type SetFields<V> = (type: string, fields: *[], determiner?: () => boolean) => BluePrint<V>;

export type SetValue<V> = (value: V) => BluePrint<V>;

export type SetDefaultValue<V> = (defaultValue: V) => BluePrint<V>;

export type SetAllow<V> = (role: FieldRole<V>, ...scope: FieldScope<V>[]) => BluePrint<V>;

export type SetDeny<V> = (role: FieldRole<V>, ...scope: FieldScope<V>[]) => BluePrint<V>;

export type SetUse<V> = (middleware: FieldMiddleware<V>) => BluePrint<V>;

export type SetOptions<V> = (options: { [string]: mixed }) => BluePrint<V>;

export type FieldMiddleware<V> = (event: string, field: BluePrint<V>) => BluePrint<V>;

export type BluePrint<V: *> = {
  code: string,
  attributes: {
    label: null | string,
    defaultValue?: V,
    validate: Array<(*) => BluePrint<V>>,
    sanitize: Array<(*) => BluePrint<V>>,
    middleware: FieldMiddleware<V>[],
    fields: *[],
    tags: string[],
    options: { [string]: mixed },
    allow: Array<[FieldRole<V>, FieldScope<V>[]]>,
    deny: Array<[FieldRole<V>, FieldScope<V>[]]>,
  },
  store: {
    raw?: V,
    value?: V,
  },
  validation: {
    result: null | boolean,
    messages: string[],
  },
  validate: SetValidate<V>,
  validated: SetValidated<V>,
  sanitize: SetSanitize<V>,
  allow: SetAllow<V>,
  deny: SetDeny<V>,
  value: SetValue<V>,
  defaultValue: SetDefaultValue<V>,
  use: SetUse<V>,
  tag: SetTag<V>,
  fields: SetFields<V>,
  options: SetOptions<V>,
};

function validate(...validators) {
  return { ...this, attributes: { ...this.attributes, validate: validators } };
}

function validated(result, messages) {
  return { ...this, validation: { ...this.validation, result, messages } };
}

function defaultValue(defaultValue) {
  return { ...this, attributes: { ...this.attributes, defaultValue } };
}

function value(value) {
  return { ...this, store: { ...this.store, raw: value, value } };
}

function sanitize(...sanitizers) {
  return { ...this, attributes: { ...this.attributes, sanitize: sanitizers } };
}

function fields(type, fields, determiner) {
  return {
    ...this,
    attributes: {
      ...this.attributes,
      fields: [...(this.attributes.fields || []), { type, fields, determiner }],
    },
  };
}

function allow(role, ...scope) {
  return {
    ...this,
    attributes: {
      ...this.attributes,
      allow: [...(this.attributes.allow || []), [role, scope]],
    },
  };
}

function deny(role, ...scope) {
  return {
    ...this,
    attributes: {
      ...this.attributes,
      deny: [...(this.attributes.deny || []), [role, scope]],
    },
  };
}

function tag(...tags) {
  return {
    ...this,
    attributes: {
      ...this.attributes,
      tags: [...(this.attributes.tags || []), ...tags],
    },
  };
}

function use(middleware) {
  return {
    ...this,
    attributes: {
      ...this.attributes,
      middleware: [...(this.attributes.middleware || []), middleware],
    },
  };
}

function options(options) {
  return { ...this, attributes: { ...this.attributes, options } };
}

function trigger() {}

const field = <V: *>(code: string, label: string): BluePrint<V> => ({
  code,
  attributes: {
    label,
    validate: [],
    sanitize: [],
    middleware: [],
    tags: [],
    fields: [],
    options: {},
    allow: [],
    deny: [],
  },
  store: {
    raw: undefined,
    value: undefined,
  },
  validation: {
    result: null,
    messages: [],
  },
  validate,
  validated,
  sanitize,
  allow,
  deny,
  use,
  trigger,
  tag,
  fields,
  value,
  defaultValue,
  options,
});

const schema = [
  field<string>('first_name', 'First Name')
    .defaultValue('Hi')
    .tag('awesome', 'main')
    .use((event, blueprint) => {
      return blueprint;
    })
    .validate(simpleValidator('required|min:4'))
    .sanitize(field => ({ ...field }.value(field.attributes.value.toUpperCase())))
    .deny('*', '*')
    .allow('USER', 'R')
    .allow('DB', 'R', 'W'),
  // While populating we should spread operator
  field('phones', 'Phone Numbers').fields('collection', [
    field<string | null>('area_code', 'Area Code'),
    field<string>('phone_number', 'Phone Number'),
    field<string | null>('ext', 'Extension'),
  ]),
];

// ---------

type IsAllowedSync = (field: BluePrint<*>, roles: FieldRole<*>[], scope: FieldScope<*>[]) => boolean;

type IsDeniedSync = (field: BluePrint<*>, roles: FieldRole<*>[], scope: FieldScope<*>[]) => boolean;

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

type PopulateSync = (
  schema: FieldSchema,
  data: { [string]: mixed },
  roles: FieldRole<*>[],
  scope: FieldScope<*>[],
) => FieldSchema;

const populateSync: PopulateSync = (schema, data, roles, scope) =>
  schema.map(field => {
    if (isDeniedSync(field, roles, scope) && !isAllowedSync(field, roles, scope)) {
      return field;
    }
    // This is nice but what about fields?
    // Should we also store the value for parents
    return { ...field }.value(data[field.code]).trigger('SET_VALUE');
  }, []);

const fromDB = populateSync(schema, { first_name: 'Tom' }, ['DB'], ['W']);

console.log(fromDB);
// const withUserInput = await populate(fromDB, {}, ['USER'], ['W']);
// const validated = await verify(withUserInput);
// const masked = await mask(withUserInput, ['USER'], ['R']);
//
// const toObjs = convertToObj(masked);
// const toAPI = convertToAPI(masked);
