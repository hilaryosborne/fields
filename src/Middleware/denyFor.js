import eventMatchesPolicies from '../Helpers/eventMatchesPolicies';
import type { BluePrint, FieldEvent } from '../index';
import type { FieldRole, FieldScope } from '../middleware';

export type DenyFor<V> = (
  role: FieldRole<*>,
  ...scope: FieldScope<*>[]
) => (event: FieldEvent, field: BluePrint<*>) => BluePrint<*>;

export const denyFor: DenyFor = (role, ...scope) => (event, field) =>
  event.event === 'APPLY_POLICIES' && eventMatchesPolicies(field, [role], scope, event.roles, event.scope)
    ? {
        ...field,
        etc: {
          ...field.etc,
          policyCheck: {
            eventId: event.uuid,
            result: false,
          },
        },
      }
    : field;

export default denyFor;
