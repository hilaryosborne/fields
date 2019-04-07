// @flow

import { isPolicyAllowed } from '../Policy/Helpers/index';
import type { BluePrint } from '../../Types/BluePrint';

type GroupedEventHandler = (event: *, field: BluePrint) => BluePrint;

const groupedEventHandler: GroupedEventHandler = (event, field) => {
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
          groups: event.value.map(val =>
            field.etc.fields.map(_field => _field.trigger({ ...event, value: val[_field.code] })),
          ),
        },
      };
    }
    default: {
      return {
        ...field,
        etc: {
          ...field.etc,
          groups: field.etc.groups.map(fields => fields.map(_field => _field.trigger(event))),
        },
      };
    }
  }
};

export default groupedEventHandler;
