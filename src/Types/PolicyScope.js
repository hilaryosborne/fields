// @flow

import type { BluePrint } from './BluePrint';

export type PolicyScope = string | ((field: BluePrint) => string);
