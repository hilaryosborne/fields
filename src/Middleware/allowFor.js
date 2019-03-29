// @flow

import eventMatchesPolicies from '../Helpers/eventMatchesPolicies';
import type { BluePrint } from '../Types/BluePrint';
import type { PolicyRole } from '../Types/PolicyRole';
import type { PolicyScope } from '../Types/PolicyScope';
import type { ApplyPolicyEvent } from '../Types/Events/ApplyPolicyEvent';

export type AllowFor = (
  role: PolicyRole,
  ...scope: PolicyScope[]
) => (event: ApplyPolicyEvent, field: BluePrint) => BluePrint;

export const allowFor: AllowFor = (role, ...scope) => (event, field) => {
  switch (event.action) {
    case 'APPLY_POLICIES': {
      if (eventMatchesPolicies(field, [role], scope, event.roles, event.scope)) {
        return {
          ...field,
          etc: {
            ...field.etc,
            policyCheck: {
              eventId: event.uuid,
              result: true,
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

export default allowFor;
