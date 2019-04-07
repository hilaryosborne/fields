// @flow

import type { BluePrint } from '../../../Types/BluePrint';
import type { PolicyRole } from '../Types/PolicyRole';
import type { PolicyScope } from '../Types/PolicyScope';

type EventMatchesPolicies = (
  field: BluePrint,
  policyRoles: PolicyRole[],
  policyScope: PolicyScope[],
  eventRoles: PolicyRole[],
  eventScope: PolicyScope[],
) => boolean;

const eventMatchesPolicies: EventMatchesPolicies = (field, policyRoles, policyScope, eventRoles, eventScope) => {
  const calcPolicyRoles = policyRoles.map(role => (typeof role === 'function' ? role(field) : role));
  const calcPolicyScope = policyScope.map(scope => (typeof scope === 'function' ? scope(field) : scope));
  const calcEventRoles = eventRoles.map(role => (typeof role === 'function' ? role(field) : role));
  const calcEventScope = eventScope.map(scope => (typeof scope === 'function' ? scope(field) : scope));
  if (calcPolicyRoles.indexOf('*') > -1 && calcPolicyScope.indexOf('*') > -1) {
    return true;
  } else if (calcPolicyRoles.indexOf('*') > -1 && calcPolicyScope.some(scope => calcEventScope.indexOf(scope) > -1)) {
    return true;
  } else if (calcPolicyScope.indexOf('*') > -1 && calcPolicyRoles.some(role => calcEventRoles.indexOf(role) > -1)) {
    return true;
  } else if (
    calcPolicyRoles.some(role => calcEventRoles.indexOf(role) > -1) &&
    calcPolicyScope.some(scope => calcEventScope.indexOf(scope) > -1)
  ) {
    return true;
  } else {
    return false;
  }
};

export default eventMatchesPolicies;
