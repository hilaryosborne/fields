// @flow

import type { BluePrint } from './BluePrint';

export type BluePrintMiddleware = (parent: BluePrint) => BluePrint;
