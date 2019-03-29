// @flow

import shortid from 'shortid';
import { field } from './Field';
import { denyFor, allowFor, hasSimpleValue, simplyValidate } from './Middleware';

const schema = [
  field('first_name', 'First Name')
    .tag('awesome', 'main')
    .use(hasSimpleValue('Hi'))
    .use(denyFor('*', '*'))
    .use(allowFor('USER', 'R'))
    .use(allowFor('DB', 'R', 'W'))
    .use(simplyValidate('required|min:4')),
  // field('phones', 'Phone Numbers').use(
  //   collection([field('area_code', 'Area Code'), field('phone_number', 'Phone Number'), field('ext', 'Extension')], []),
  // ),
];

// ---------

// const fromDB = populateSync(schema, { first_name: 'Tom' }, ['DB'], ['W']);

const newField = schema[0]
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
  .trigger({
    uuid: shortid(),
    action: 'APPLY_VALUE',
    value: 'Thomas'
  });

console.log(newField);

// console.log();
// const withUserInput = await populate(fromDB, {}, ['USER'], ['W']);
// const validated = await verify(withUserInput);
// const masked = await mask(withUserInput, ['USER'], ['R']);
//
// const toObjs = convertToObj(masked);
// const toAPI = convertToAPI(masked);
