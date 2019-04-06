// @flow

import shortid from 'shortid';
import { field } from './Field';
import { fields, fieldsDefault, denyFor, allowFor, simpleValue, simpleDefault, simpleValidation } from './Middleware';

const schema = [
  field('first_name', 'First Name')
    .tag('awesome', 'main')
    .use(simpleValue)
    .use(simpleDefault('Hi'))
    .use(denyFor('*', '*'))
    .use(allowFor('USER', 'R'))
    .use(allowFor('DB', 'R', 'W'))
    .use(simpleValidation('required|min:4')),
  field('membership', 'Membership').use(
    fields(
      field('membership_level', 'Membership Level')
        .use(simpleValue)
        .use(denyFor('*', '*')),
      field('membership_type', 'Membership Type')
        .use(simpleValue)
        .use(denyFor('*', '*')),
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
  });

console.log(newField);

// console.log();
// const withUserInput = await populate(fromDB, {}, ['USER'], ['W']);
// const validated = await verify(withUserInput);
// const masked = await mask(withUserInput, ['USER'], ['R']);
//
// const toObjs = convertToObj(masked);
// const toAPI = convertToAPI(masked);
