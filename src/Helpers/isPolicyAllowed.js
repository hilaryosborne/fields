// @flow

import type { BluePrint } from '../Types/BluePrint';

type IsPolicyAllowed = (field: BluePrint) => boolean;

const isPolicyAllowed: IsPolicyAllowed = field => {
  return (
    typeof field.etc.policyCheck === 'undefined' ||
    typeof field.etc.policyCheck.result === 'undefined' ||
    field.etc.policyCheck.result !== false
  );
};

export default isPolicyAllowed;
