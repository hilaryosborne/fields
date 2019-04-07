// @flow

import { isPolicyAllowed } from '../Policy/Helpers/index';
import type { BluePrint } from '../../Types/BluePrint';

type GroupedDefaultEventHandler = (
  defaultValue: Array<{ [string]: mixed }>,
) => (event: *, field: BluePrint) => BluePrint;

const groupedDefaultEventHandler: GroupedDefaultEventHandler = defaultValue => (event, field) => {
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
          value: field.etc.value || defaultValue,
          groups: calcDefaultValue.map(val =>
            field.etc.fields.map(_field => _field.trigger({ ...event, defaultValue: val[_field.code] })),
          ),
        },
      };
    }
    default: {
      return field;
    }
  }
};

export default groupedDefaultEventHandler;
