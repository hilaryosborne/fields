// @flow

import denyForEventHandler from './denyForEventHandler';
import type { BluePrint } from '../../Types/BluePrint';
import type { PolicyRole } from './Types/PolicyRole';
import type { PolicyScope } from './Types/PolicyScope';

export type DenyFor = (role: PolicyRole, ...scope: PolicyScope[]) => (parent: BluePrint) => BluePrint;

export const denyFor: DenyFor = (role, ...scope) => parent => {
  return {
    ...parent,
    attributes: {
      ...parent.attributes,
      middleware: [...(parent.attributes.middleware || []), denyForEventHandler(role, scope)],
    },
  };
};

export default denyFor;
