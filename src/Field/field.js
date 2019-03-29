// @flow

import type { BluePrint } from '../Types/BluePrint';

const field = (code: string, label: string): BluePrint => ({
  code,
  attributes: {
    label,
    middleware: [],
    tags: [],
  },
  etc: {},
  use: function use(middleware) {
    return {
      ...this,
      attributes: {
        ...this.attributes,
        middleware: [...(this.attributes.middleware || []), middleware],
      },
    };
  },
  trigger: function trigger(event) {
    return this.attributes.middleware.reduce((field, middleware) => middleware(event, field), this);
  },
  tag: function tag(...tags) {
    return {
      ...this,
      attributes: {
        ...this.attributes,
        tags: [...(this.attributes.tags || []), ...tags],
      },
    };
  },
});

export default field;
