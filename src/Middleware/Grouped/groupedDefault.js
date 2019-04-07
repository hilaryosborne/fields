// @flow

import groupedDefaultEventHandler from './groupedDefaultEventHandler';
import type { BluePrint } from '../../Types/BluePrint';

type GroupedDefault = (defaultValue: Array<{ [string]: mixed }>) => (parent: BluePrint) => BluePrint;

const groupedDefault: GroupedDefault = defaultValue => parent => ({
  ...parent,
  attributes: {
    ...parent.attributes,
    middleware: [...(parent.attributes.middleware || []), groupedDefaultEventHandler(defaultValue)],
  },
});

export default groupedDefault;
