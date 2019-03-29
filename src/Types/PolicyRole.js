// @flow

import type { BluePrint } from './BluePrint';

export type PolicyRole = string | ((field: BluePrint) => string);
