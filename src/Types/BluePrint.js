// @flow

import type { BluePrintMiddleware } from './BluePrintMiddleware';
import type { TriggerEvent } from './TriggerEvent';
import type { SetTag } from './SetTag';
import type { SetUse } from './SetUse';

export type BluePrint = {
  code: string,
  attributes: {
    label: null | string,
    middleware: BluePrintMiddleware[],
    tags: string[],
    [string]: mixed,
  },
  etc: *,
  tag: SetTag,
  use: SetUse,
  trigger: TriggerEvent,
};
