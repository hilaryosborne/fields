// @flow

import simpleDefaultEventHandler from './simpleDefaultEventHandler';
import type { BluePrint } from '../../Types/BluePrint';

type SimpleDefault = (defaultValue?: mixed) => (parent: BluePrint) => BluePrint;

const simpleDefault: SimpleDefault = defaultValue => parent => ({
  ...parent,
  attributes: {
    ...parent.attributes,
    middleware: [...(parent.attributes.middleware || []), simpleDefaultEventHandler(defaultValue)],
  },
});

export default simpleDefault;
