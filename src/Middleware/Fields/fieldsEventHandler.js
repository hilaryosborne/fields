// @flow

import { isPolicyAllowed } from '../Policy/Helpers/index';
import type { BluePrint } from '../../Types/BluePrint';

type FieldsEventHandler = (event: *, field: BluePrint) => BluePrint;

const fieldsEventHandler: FieldsEventHandler = (event, field) => {
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
          fields: field.etc.fields.map(_field => _field.trigger({ ...event, value: event.value[_field.code] })),
        },
      };
    }
    default: {
      return {
        ...field,
        etc: {
          ...field.etc,
          fields: field.etc.fields.map(_field => _field.trigger(event)),
        },
      };
    }
  }
};

export default fieldsEventHandler;
