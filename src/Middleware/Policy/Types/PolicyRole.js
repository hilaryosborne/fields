// @flow

import type { BluePrint } from '../../../Types/BluePrint';

export type PolicyRole = string | ((field: BluePrint) => string);
