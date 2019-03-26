// @flow

export type FieldMiddleware<V> = (event: FieldEvent, field: BluePrint<V>) => BluePrint<V>;
