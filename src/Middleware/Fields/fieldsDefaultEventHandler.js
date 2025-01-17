// @flow

import { isPolicyAllowed } from '../Policy/Helpers/index';
import type { BluePrint } from '../../Types/BluePrint';

type FieldsDefaultEventHandler = (defaultValue: { [string]: mixed }) => (event: *, field: BluePrint) => BluePrint;

const fieldsDefaultEventHandler: FieldsDefaultEventHandler = defaultValue => (event, field) => {
  if (!isPolicyAllowed(field)) {
    return field;
  }
  switch (event.action) {
    case 'APPLY_DEFAULT_VALUE': {
      const calcDefaultValue = event.defaultValue || defaultValue;
      return {
        ...field,
        etc: {
          ...field.etc,
          defaultValue: calcDefaultValue,
          fields: field.etc.fields.map(_field =>
            ({ ..._field }.trigger({ ...event, defaultValue: calcDefaultValue[_field.code] })),
          ),
          value: field.etc.value || defaultValue,
        },
      };
    }
    default: {
      return field;
    }
  }
};

export default fieldsDefaultEventHandler;
