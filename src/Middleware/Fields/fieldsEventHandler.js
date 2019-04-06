// @flow

import { isPolicyAllowed } from '../../Helpers';
import type { BluePrint } from '../../Types/BluePrint';

type FieldsEventHandler = (fields: BluePrint[]) => (event: *, field: BluePrint) => BluePrint;

const fieldsEventHandler: FieldsEventHandler = fields => (event, field) => {
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
          fields: fields.map<BluePrint>(_field =>
            ({ ..._field }.trigger({ ...event, value: event.value[_field.code] })),
          ),
        },
      };
    }
    default: {
      return field;
    }
  }
};

export default fieldsEventHandler;
