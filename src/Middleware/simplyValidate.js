// @flow

import validator from 'validatorjs';
import type { BluePrint } from '../Types/BluePrint';
import type { ApplyValidationEvent } from '../Types/Events/ApplyValidationEvent';

type SimplyValidate = (...rules: string[]) => (event: ApplyValidationEvent, field: BluePrint) => BluePrint;

export const simplyValidate: SimplyValidate = (...rules) => (event, field) => {
  switch (event.action) {
    case 'APPLY_VALIDATION': {
      const validation = new validator({ value: field.etc && field.etc.value }, { value: rules.join('|') });
      return {
        ...field,
        etc: {
          ...field.etc,
          validation: {
            eventId: event.uuid,
            result: validation.passes(),
            errors: validation.errors.get('value'),
          },
        },
      };
    }
    default: {
      return field;
    }
  }
};

export default simplyValidate;
