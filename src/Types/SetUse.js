// @flow

import type { BluePrint } from './BluePrint';
import type { BluePrintMiddleware } from './BluePrintMiddleware';

export type SetUse = (...middlewares: BluePrintMiddleware[]) => BluePrint;
