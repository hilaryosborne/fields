// @flow

import { isPolicyAllowed } from '../Helpers';
import type { BluePrint } from '../Types/BluePrint';
import type { ApplySimpleValueEvent } from '../Types/Events/ApplySimpleValueEvent';
import type { ApplyDefaultEvent } from '../Types/Events/ApplyDefaultEvent';

type HasSimpleValue = (
  defaultValue?: mixed,
) => (event: ApplySimpleValueEvent | ApplyDefaultEvent, field: BluePrint) => BluePrint;

const hasSimpleValue: HasSimpleValue = defaultValue => (event, field) => {
  if (!isPolicyAllowed(field)) {
    return field;
  }
  switch (event.action) {
    case 'APPLY_DEFAULT_VALUE': {
      return {
        ...field,
        etc: {
          ...field.etc,
          defaultValue,
          value: field.etc.value || defaultValue,
        },
      };
    }
    case 'APPLY_VALUE': {
      return {
        ...field,
        etc: {
          ...field.etc,
          value: event.value,
        },
      };
    }
    default: {
      return field;
    }
  }
};

export default hasSimpleValue;
