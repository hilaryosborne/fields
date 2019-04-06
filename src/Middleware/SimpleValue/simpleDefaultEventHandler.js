// @flow

import { isPolicyAllowed } from '../../Helpers/index';
import type { BluePrint } from '../../Types/BluePrint';
import type { ApplyDefaultEvent } from '../../Types/Events/ApplyDefaultEvent';

type SimpleDefaultEventHandler = (defaultValue?: mixed) => (event: ApplyDefaultEvent, field: BluePrint) => BluePrint;

const simpleDefaultEventHandler: SimpleDefaultEventHandler = defaultValue => (event, field) => {
  if (!isPolicyAllowed(field)) {
    return field;
  }
  switch (event.action) {
    case 'APPLY_DEFAULT_VALUE': {
      return {
        ...field,
        etc: {
          ...field.etc,
          defaultValue: event.defaultValue || defaultValue,
          value: field.etc.value || defaultValue,
        },
      };
    }
    default: {
      return field;
    }
  }
};

export default simpleDefaultEventHandler;
