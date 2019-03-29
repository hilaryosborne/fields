// @flow

import type { PolicyRole } from '../PolicyRole';
import type { PolicyScope } from '../PolicyScope';

export type ApplyPolicyEvent = {
  uuid: string,
  action: 'APPLY_POLICIES',
  roles: PolicyRole[],
  scope: PolicyScope[],
};
