// @flow

export type TriggerFieldEvent<V> = (event: FieldEvent, field?: BluePrint<V>) => BluePrint<V>;
