// @flow

import type { BluePrint } from './BluePrint';
import type { BluePrintMiddleware } from './BluePrintMiddleware';

export type SetUse = (middleware: BluePrintMiddleware) => BluePrint;
