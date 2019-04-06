// @flow

import simpleValueEventHandler from './simpleValueEventHandler';
import type { BluePrint } from '../../Types/BluePrint';

type SimpleValue = (parent: BluePrint) => BluePrint;

const simpleValue: SimpleValue = parent => ({
  ...parent,
  attributes: {
    ...parent.attributes,
    middleware: [...(parent.attributes.middleware || []), simpleValueEventHandler],
  },
});

export default simpleValue;
