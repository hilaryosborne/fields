// @flow

import simpleValidationEventHandler from './simpleValidationEventHandler';
import type { BluePrint } from '../../Types/BluePrint';

type SimpleValidation = (...rules: string[]) => (parent: BluePrint) => BluePrint;

export const simpleValidation: SimpleValidation = (...rules) => parent => ({
  ...parent,
  attributes: {
    ...parent.attributes,
    middleware: [...(parent.attributes.middleware || []), simpleValidationEventHandler(rules)],
  },
});

export default simpleValidation;
