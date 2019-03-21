// @flow

import shortid from 'shortid';

import { allowFor, denyFor, simplyValidate, toUpperCase } from './middleware';

export type FieldSchema = *[];

export type SetTag<V> = (...tags: string[]) => BluePrint<V>;

export type SetFields<V> = (type: string, fields: *[], determiner?: () => boolean) => BluePrint<V>;

export type SetValue<V> = (value: V) => BluePrint<V>;

export type SetDefaultValue<V> = (defaultValue: V) => BluePrint<V>;

export type SetUse<V> = (middleware: FieldMiddleware<V>) => BluePrint<V>;

export type FieldEvent = {
  uuid: string,
  event: string,
  [string]: mixed,
};

export type TriggerFieldEvent<V> = (event: FieldEvent, field?: BluePrint<V>) => BluePrint<V>;

export type SetOptions<V> = (options: { [string]: mixed }) => BluePrint<V>;

export type FieldMiddleware<V> = (event: FieldEvent, field: BluePrint<V>) => BluePrint<V>;

export type BluePrint<V: *> = {
  code: string,
  attributes: {
    label: null | string,
    defaultValue?: V,
    middleware: FieldMiddleware<V>[],
    fields: *[],
    tags: string[],
    options: { [string]: mixed },
    [string]: mixed,
  },
  value: SetValue<V>,
  defaultValue: SetDefaultValue<V>,
  use: SetUse<V>,
  trigger: TriggerFieldEvent<V>,
  tag: SetTag<V>,
  fields: SetFields<V>,
  options: SetOptions<V>,
};

function defaultValue(defaultValue) {
  return { ...this, attributes: { ...this.attributes, defaultValue } };
}

function value(value) {
  return { ...this, store: { ...this.store, raw: value, value } };
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

function trigger(event) {
  return this.attributes.middleware.reduce((field, middleware) => middleware(event, field), this);
}

const field = <V: *>(code: string, label: string): BluePrint<V> => ({
  code,
  attributes: {
    label,
    middleware: [],
    tags: [],
    fields: [],
    options: {},
  },
  store: {
    raw: undefined,
    value: undefined,
  },
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
    .use(denyFor('*', '*'))
    .use(allowFor('USER', 'R'))
    .use(allowFor('DB', 'R', 'W'))
    .use(simplyValidate('required|min:4'))
    .use(toUpperCase),
  field('phones', 'Phone Numbers').fields('collection', [
    field<string | null>('area_code', 'Area Code'),
    field<string>('phone_number', 'Phone Number'),
    field<string | null>('ext', 'Extension'),
  ]),
];

// ---------

// const fromDB = populateSync(schema, { first_name: 'Tom' }, ['DB'], ['W']);

const newField = schema[0].trigger({
  uuid: shortid(),
  event: 'APPLY_POLICIES',
  roles: ['DB'],
  scope: ['W'],
});

console.log(newField);

// console.log();
// const withUserInput = await populate(fromDB, {}, ['USER'], ['W']);
// const validated = await verify(withUserInput);
// const masked = await mask(withUserInput, ['USER'], ['R']);
//
// const toObjs = convertToObj(masked);
// const toAPI = convertToAPI(masked);
