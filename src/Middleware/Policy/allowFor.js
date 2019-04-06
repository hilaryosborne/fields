// @flow

import allowForEventHandler from './allowForEventHandler';
import type { BluePrint } from '../../Types/BluePrint';
import type { PolicyRole } from './Types/PolicyRole';
import type { PolicyScope } from './Types/PolicyScope';

export type AllowFor = (role: PolicyRole, ...scope: PolicyScope[]) => (parent: BluePrint) => BluePrint;

export const allowFor: AllowFor = (role, ...scope) => parent => {
  return {
    ...parent,
    attributes: {
      ...parent.attributes,
      middleware: [...(parent.attributes.middleware || []), allowForEventHandler(role, scope)],
    },
  };
};

export default allowFor;
