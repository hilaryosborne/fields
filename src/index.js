// @flow

type SetContext<V> = (context: string) => BluePrint<V>;

type SetValidate<V> = (...args: Array<string>) => BluePrint<V>;

type SetSanitize<V> = (...args: Array<string>) => BluePrint<V>;

type SetChildren<V> = (...args: *[]) => BluePrint<V>;

type SetAllow<V> = (role: string, scope: string[]) => BluePrint<V>;

type SetDeny<V> = (role: string, scope: string[]) => BluePrint<V>;

type SetUse<V> = (middleware: FieldMiddleware<V>) => BluePrint<V>;

type FieldMiddleware<V> = (event: string, field: BluePrint<V>) => BluePrint<V>;

type BluePrint<V: *> = {
  code: string,
  attributes: {
    label: null | string,
    defaultValue: V,
    context: null | string,
    validate: Array<string>,
    sanitize: Array<string>,
    middleware: FieldMiddleware<V>[],
  },
  context: SetContext<V>,
  validate: SetValidate<V>,
  sanitize: SetSanitize<V>,
  allow: SetAllow<V>,
  deny: SetDeny<V>,
  use: SetUse<V>,
  children: SetChildren<V>,
};

function context(context) {
  return { ...this, attributes: { ...this.attributes, context } };
}

function validate(...args) {
  return { ...this, attributes: { ...this.attributes, validate: args } };
}

function sanitize(...args) {
  return { ...this, attributes: { ...this.attributes, sanitize: args } };
}

function children(...args) {
  return {
    ...this,
    attributes: {
      ...this.attributes,
      children: [...(this.attributes.children || []), args],
    },
  };
}

function allow(role, scope) {
  return {
    ...this,
    attributes: {
      ...this.attributes,
      allow: [...(this.attributes.allow || []), [role, scope]],
    },
  };
}

function deny(role, scope) {
  return {
    ...this,
    attributes: {
      ...this.attributes,
      allow: [...(this.attributes.deny || []), [role, scope]],
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

const field = <V: *>(
  code: string,
  label: string,
  defaultValue: V,
): BluePrint<V> => ({
  code,
  attributes: {
    label,
    defaultValue,
    context: null,
    context: null,
    validate: [],
    sanitize: [],
    middleware: [],
  },
  context,
  validate,
  sanitize,
  allow,
  deny,
  use,
  children,
});

const schema = [
  field<string>('first_name', 'First Name', '')
    .context('string')
    .use((event, blueprint) => {
      return blueprint;
    })
    .validate('string,min:4')
    .sanitize('string')
    .deny('*', ['*'])
    .allow('USER', ['R']),
  field('phones', 'Phone Numbers', [])
    .context('collection')
    .children(
      field<string | null>('area_code', 'Area Code', null).context('string'),
      field<string>('phone_number', 'Phone Number', '').context('string'),
      field<string | null>('ext', 'Extension', null).context('string'),
    ),
];

console.log(schema);
