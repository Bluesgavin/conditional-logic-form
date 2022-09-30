# conditional-logic-form

![Github License](https://img.shields.io/badge/license-MIT-green)

## Description

a conditional-logic-form that you can use in modern browsers. It's lightweight and requires no dependencies.


## Demo


## Usage

```javascript
import  ConditionalLogic from 'ConditionalLogic';

const list = [
        {
          id: 1111,
          label: '出行方式',
          list: [
            {
              id: 1111,
              label: 'trip mode',
            },
            {
              id: 222,
              label: 'flight',
            },
          ],
          conditionValue: 1,
        },
        {
          id: 2222,
          label: 'type',
          list: [
            {
              id: 1111,
              label: 'trip mode',
            },
            {
              id: 222,
              label: 'flight',
            },
            {
              id: 33,
              label: 'date',
            },
          ],
          conditionValue: 1,
        },
];
const conditionalLogicForm = new ConditionalLogic('#form', { list });
```

and you can get the data from the form

```javascript
const data = conditionalLogicForm.getData();
```

## License

This project is licensed under the [MIT License](https://github.com/this/project/blob/master/LICENSE)