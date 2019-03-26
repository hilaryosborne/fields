// @flow

export type SetFields<V> = (type: string, fields: *[], determiner?: () => boolean) => BluePrint<V>;
