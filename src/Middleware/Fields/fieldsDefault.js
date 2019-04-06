// @flow

import fieldsDefaultEventHandler from './fieldsDefaultEventHandler';
import type { BluePrint } from '../../Types/BluePrint';

type FieldsDefault = (defaultValue: { [string]: mixed }) => (parent: BluePrint) => BluePrint;

const fieldsDefault: FieldsDefault = defaultValue => parent => ({
  ...parent,
  attributes: {
    ...parent.attributes,
    middleware: [...(parent.attributes.middleware || []), fieldsDefaultEventHandler(defaultValue)],
  },
});

export default fieldsDefault;
