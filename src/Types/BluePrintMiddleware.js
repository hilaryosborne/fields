// @flow

import type { BluePrint } from './BluePrint';

export type BluePrintMiddleware = (event: *, field: BluePrint) => BluePrint;
