// @flow

type FieldSchema = *[];

type FieldRole<V> = string | ((field: BluePrint<V>) => string);

type FieldScope<V> = string | ((field: BluePrint<V>) => string);

type SetValidate<V> = (...validators: string[]) => BluePrint<V>;

type SetSanitize<V> = (...sanitizers: string[]) => BluePrint<V>;

type SetTag<V> = (...tags: string[]) => BluePrint<V>;

type SetFields<V> = (type: string, fields: *[], determiner?: () => boolean) => BluePrint<V>;

type SetValue<V> = (value: V) => BluePrint<V>;

type SetDefaultValue<V> = (defaultValue: V) => BluePrint<V>;

type SetAllow<V> = (role: FieldRole<V>, ...scope: FieldScope<V>[]) => BluePrint<V>;

type SetDeny<V> = (role: FieldRole<V>, ...scope: FieldScope<V>[]) => BluePrint<V>;

type SetUse<V> = (middleware: FieldMiddleware<V>) => BluePrint<V>;

type SetOptions<V> = (options: { [string]: mixed }) => BluePrint<V>;

type FieldMiddleware<V> = (event: string, field: BluePrint<V>) => BluePrint<V>;

type BluePrint<V: *> = {
  code: string,
  attributes: {
    label: null | string,
    defaultValue?: V,
    value?: V,
    validate: Array<string>,
    sanitize: Array<string>,
    middleware: FieldMiddleware<V>[],
    fields: *[],
    tags: string[],
    options: { [string]: mixed },
    allow: Array<[FieldRole<V>, FieldScope<V>[]]>,
    deny: Array<[FieldRole<V>, FieldScope<V>[]]>,
  },
  validate: SetValidate<V>,
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

function defaultValue(defaultValue) {
  return { ...this, attributes: { ...this.attributes, defaultValue } };
}

function value(value) {
  console.log(value, 'THIS IS ME');
  return { ...this, attributes: { ...this.attributes, value } };
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
  validate,
  sanitize,
  allow,
  deny,
  use,
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
    .validate('string,min:4')
    .sanitize('string')
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
    return {...field}.value(data[field.code]);
  }, []);

const fromDB = populateSync(schema, { first_name: 'Tom' }, ['DB'], ['W']);

console.log(fromDB);
// const withUserInput = await populate(fromDB, {}, ['USER'], ['W']);
// const validated = await verify(withUserInput);
// const masked = await mask(withUserInput, ['USER'], ['R']);
//
// const toObjs = convertToObj(masked);
// const toAPI = convertToAPI(masked);
