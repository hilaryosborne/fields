// @flow

import { isPolicyAllowed } from '../../Helpers/index';
import type { BluePrint } from '../../Types/BluePrint';

type SimpleValueEventHandler = (event: *, field: BluePrint) => BluePrint;

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
