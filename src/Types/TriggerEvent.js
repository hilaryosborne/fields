// @flow

import type { BluePrint } from './BluePrint';
import type { BluePrintEvent } from './BluePrintEvent';

export type TriggerEvent = (event: ?BluePrintEvent, field?: BluePrint) => BluePrint;
