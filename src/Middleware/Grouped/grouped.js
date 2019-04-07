// @flow

import groupedEventHandler from './groupedEventHandler';
import type { BluePrint } from '../../Types/BluePrint';

type Grouped = (...fields: BluePrint[]) => (parent: BluePrint) => BluePrint;

const grouped: Grouped = (...fields) => parent => ({
  ...parent,
  etc: {
    ...parent.etc,
    fields: fields,
    groups: [],
  },
  attributes: {
    ...parent.attributes,
    middleware: [...(parent.attributes.middleware || []), groupedEventHandler],
  },
});

export default grouped;
