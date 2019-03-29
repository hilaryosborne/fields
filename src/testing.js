// @flow

type ThingOne = {
  action: 'SOME_ACTION',
  value: string
};

type ThingTwo = {
  action: 'ANOTHER_ACTION',
  name: string
};

const doThings = (things: ThingOne | ThingTwo) => {
  switch (things.action) {
    case 'SOME_ACTION' : {
      return things.value;
    }
    case 'ANOTHER_ACTION' : {
      return things.name;
    }
    default : {
      return 'nothing'
    }
  }
};

doThings({
  action: 'SOME_ACTION',
  value: ''
});
