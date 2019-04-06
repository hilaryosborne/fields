// @flow

import fieldsEventHandler from "./fieldsEventHandler";
import type { BluePrint } from '../../Types/BluePrint';

type Fields = (...fields: BluePrint[]) => (parent: BluePrint) => BluePrint;

const fields: Fields = (...fields) => parent => ({
  ...parent,
  etc: {
    ...parent.etc,
    fields: fields,
  },
  attributes: {
    ...parent.attributes,
    middleware: [...(parent.attributes.middleware || []), fieldsEventHandler(fields)],
  },
});

export default fields;
