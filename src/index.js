// @flow

type SetValidate<V> = (...validators: string[]) => BluePrint<V>;

type SetSanitize<V> = (...sanitizers: string[]) => BluePrint<V>;

type SetTag<V> = (...tags: string[]) => BluePrint<V>;

type SetFields<V> = (
  type: string,
  fields: *[],
  determiner?: () => boolean,
) => BluePrint<V>;

type SetAllow<V> = (role: string, ...scope: string[]) => BluePrint<V>;

type SetValue<V> = (value: V) => BluePrint<V>;

type SetDeny<V> = (role: string, ...scope: string[]) => BluePrint<V>;

type SetUse<V> = (middleware: FieldMiddleware<V>) => BluePrint<V>;

type SetOptions<V> = (options: {[string]: mixed}) => BluePrint<V>;

type FieldMiddleware<V> = (event: string, field: BluePrint<V>) => BluePrint<V>;

type BluePrint<V: *> = {
  code: string,
  attributes: {
    label: null | string,
    value?: V,
    validate: Array<string>,
    sanitize: Array<string>,
    middleware: FieldMiddleware<V>[],
    fields: *[],
    tags: string[],
    options: {[string]: mixed}
  },
  validate: SetValidate<V>,
  sanitize: SetSanitize<V>,
  allow: SetAllow<V>,
  deny: SetDeny<V>,
  value: SetValue<V>,
  use: SetUse<V>,
  tag: SetTag<V>,
  fields: SetFields<V>,
  options: SetOptions<V>,
};

function validate(...validators) {
  return { ...this, attributes: { ...this.attributes, validate: validators } };
}

function value(value) {
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
      allow: [...(this.attributes.deny || []), [role, scope]],
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
  return { ...this, attributes: { ...this.attributes, options  } };
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
    options: {}
  },
  validate,
  sanitize,
  allow,
  deny,
  use,
  tag,
  fields,
  value,
  options
});

const schema = [
  field<string>('first_name', 'First Name')
    .value('Hi')
    .tag('awesome', 'main')
    .use((event, blueprint) => {
      return blueprint;
    })
    .validate('string,min:4')
    .sanitize('string')
    .deny('*', '*')
    .allow('USER', 'R'),
  // While populating we should spread operator
  field('phones', 'Phone Numbers').fields('collection', [
    field<string | null>('area_code', 'Area Code'),
    field<string>('phone_number', 'Phone Number'),
    field<string | null>('ext', 'Extension'),
  ]),
];

console.log(schema);

const fromDB = await populate(schema, {}, ['DB'], ['W']);
const withUserInput = await populate(fromDB, {}, ['USER'], ['W']);
const validated = await verify(withUserInput);
const masked = await mask(withUserInput, ['USER'], ['R']);

const toObjs = convertToObj(masked);
const toAPI = convertToAPI(masked);


