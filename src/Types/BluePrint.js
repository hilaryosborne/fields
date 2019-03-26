// @flow

import type {
  FieldMiddleware,
  SetDefaultValue,
  SetFields,
  SetOptions,
  SetTag,
  SetUse,
  SetValue,
  TriggerFieldEvent,
} from '../index';

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
