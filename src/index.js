// @flow

import shortid from 'shortid';
import { field } from './Field';
import { fields, fieldsDefault, denyFor, allowFor, simpleValue, simpleDefault, simpleValidation } from './Middleware';

const schema = [
  field('first_name', 'First Name')
    .tag('awesome', 'main')
    .use(simpleValue, simpleDefault('Hi'), simpleValidation('required|min:4'))
    .use(denyFor('*', '*'), allowFor('USER', 'R'), allowFor('DB', 'R', 'W')),
  field('membership', 'Membership')
    .use(denyFor('*', '*'), allowFor('USER', 'R'), allowFor('DB', 'R', 'W'))
    .use(
      fields(
        field('membership_level', 'Membership Level')
          .use(simpleValue)
          .use(allowFor('*', '*'), simpleValidation('required|min:4')),
        field('membership_type', 'Membership Type')
          .use(simpleValue, simpleValidation('required|min:4'))
          .use(allowFor('*', '*')),
      ),
      fieldsDefault({
        membership_level: 'level_8',
        membership_type: 'GOLD',
      }),
    ),
  // field('phones', 'Phone Numbers').use(
  //   hasFields([field('area_code', 'Area Code'), field('phone_number', 'Phone Number'), field('ext', 'Extension')], []),
  // ),
];

// ---------

// const fromDB = populateSync(schema, { first_name: 'Tom' }, ['DB'], ['W']);

const newField = schema[1]
  .trigger({
    uuid: shortid(),
    action: 'APPLY_POLICIES',
    roles: ['DB'],
    scope: ['R'],
  })
  .trigger({
    uuid: shortid(),
    action: 'APPLY_DEFAULT_VALUE',
  })
  // .trigger({
  //   uuid: shortid(),
  //   action: 'APPLY_VALUE',
  //   value: 'Buggs',
  // });
  .trigger({
    uuid: shortid(),
    action: 'APPLY_VALUE',
    value: {
      membership_level: 'level_5',
      membership_type: 'premium',
    },
  })
  .trigger({
    uuid: shortid(),
    action: 'APPLY_VALIDATION',
  });

console.log(newField);

// console.log();
// const withUserInput = await populate(fromDB, {}, ['USER'], ['W']);
// const validated = await verify(withUserInput);
// const masked = await mask(withUserInput, ['USER'], ['R']);
//
// const toObjs = convertToObj(masked);
// const toAPI = convertToAPI(masked);
