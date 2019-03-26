import type {BluePrint} from "./index";
import type {FieldRole, FieldScope} from "./dump";

type IsAllowedSync = (field: BluePrint<*>, roles: FieldRole<*>[], scope: FieldScope<*>[]) => boolean;

type IsDeniedSync = (field: BluePrint<*>, roles: FieldRole<*>[], scope: FieldScope<*>[]) => boolean;

export const isAllowedSync: IsAllowedSync = (policyRoles, policyScope, eventRoles, eventScope) => {
  const calcRoles = eventRoles.map(role => (typeof role === 'function' ? role(field) : role));
  const calcScope = eventRoles.map(scope => (typeof scope === 'function' ? scope(field) : scope));
  return eventRoles.reduce((curr, role) => {
    const fieldRole = typeof role === 'function' ? role(field) : role;
    const fieldScope = eventScope.map(scope => (typeof scope === 'function' ? scope(field) : scope));
    if (fieldRole.indexOf('*') > -1 && fieldScope.indexOf('*') > -1) {
      return true;
    } else if (fieldRole.indexOf('*') > -1 && fieldScope.some(scope => calcScope.indexOf(scope) > -1)) {
      return true;
    } else if (calcRoles.indexOf(fieldRole) > -1 && fieldScope.some(scope => calcScope.indexOf(scope) > -1)) {
      return true;
    } else {
      return curr;
    }
  }, false);
};

export const isDeniedSync: IsDeniedSync = (field, roles, scope) => {
  const calcRoles = roles.map(role => (typeof role === 'function' ? role(field) : role));
  const calcScope = scope.map(scope => (typeof scope === 'function' ? scope(field) : scope));
  return field.attributes.deny.length === 0
    ? false
    : field.attributes.deny.reduce((curr, [role, scope]) => {
      const fieldRole = typeof role === 'function' ? role(field) : role;
      const fieldScope = scope.map(scope => (typeof scope === 'function' ? scope(field) : scope));
      if (fieldRole.indexOf('*') > -1 && fieldScope.indexOf('*') > -1) {
        return true;
      } else if (fieldRole.indexOf('*') > -1 && fieldScope.some(scope => calcScope.indexOf(scope) > -1)) {
        return true;
      } else if (calcRoles.indexOf(fieldRole) > -1 && fieldScope.some(scope => calcScope.indexOf(scope) > -1)) {
        return true;
      } else {
        return curr;
      }
    }, false);
};
