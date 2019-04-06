// @flow

import type { BluePrint } from '../../../Types/BluePrint';

export type PolicyScope = string | ((field: BluePrint) => string);
