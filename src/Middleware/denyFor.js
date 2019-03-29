// @flow

import eventMatchesPolicies from '../Helpers/eventMatchesPolicies';
import type { BluePrint } from '../Types/BluePrint';
import type { ApplyPolicyEvent } from '../Types/Events/ApplyPolicyEvent';
import type { PolicyRole } from '../Types/PolicyRole';
import type { PolicyScope } from '../Types/PolicyScope';

export type DenyFor = (
  role: PolicyRole,
  ...scope: PolicyScope[]
) => (event: ApplyPolicyEvent, field: BluePrint) => BluePrint;

export const denyFor: DenyFor = (role, ...scope) => (event, field) => {
  switch (event.action) {
    case 'APPLY_POLICIES': {
      if (eventMatchesPolicies(field, [role], scope, event.roles, event.scope)) {
        return {
          ...field,
          etc: {
            ...field.etc,
            policyCheck: {
              eventId: event.uuid,
              result: false,
            },
          },
        };
      } else {
        return field;
      }
    }
    default: {
      return field;
    }
  }
};

export default denyFor;
