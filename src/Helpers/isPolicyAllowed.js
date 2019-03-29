// @flow

import type { BluePrint } from '../Types/BluePrint';

type IsPolicyAllowed = (field: BluePrint) => boolean;

const isPolicyAllowed: IsPolicyAllowed = field => {
  return field.etc.policyCheck && field.etc.policyCheck.result !== false;
};

export default isPolicyAllowed;
