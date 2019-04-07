// @flow

import { isPolicyAllowed } from '../Policy/Helpers/index';
import type { BluePrint } from '../../Types/BluePrint';
import type { ApplyValueEvent } from '../../Types/Events/ApplyValueEvent';

type SimpleValueEventHandler = (event: ApplyValueEvent, field: BluePrint) => BluePrint;

const simpleValueEventHandler: SimpleValueEventHandler = (event, field) => {
  if (!isPolicyAllowed(field)) {
    return field;
  }
  switch (event.action) {
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

export default simpleValueEventHandler;
