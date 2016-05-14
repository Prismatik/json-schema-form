# json-schema-form

Useful JSON Schema utility functions for forms.

## Getting started

```
npm i git+https@github.com:Prismatik/json-schema-form.git
```

## Usage

To map a data object against your schema use `mapData`.

- Fields that *do* exist in `schema` but are not supplied by `data` will return
as `undefined`.
- Fields that *do not* exist `schema` but are supplied in `data` will not be
returned.

```javascript
import { mapData } from 'json-schema-form'

const schema = {
  "sheep": {
    "type": "object",
    "name": "sheep",
    "properties": {
      "id": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "hair": {
        "type": "string",
        "pattern": "cool|daggy"
      }
    }
  }
}
const data = { id: 123, hair: 'cool', pants: true }

mapData(schema, data)

// result
{
  id: 123,
  name: undefined,
  hair: 'cool'
}
```

To create objects that use HTML form input attributes from your schema:

```javascript
import { toFormInputs } from 'json-schema-form'

const schema = {
  "sheep": {
    "type": "object",
    "name": "sheep",
    "properties": {
      "id": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "hair": {
        "type": "string",
        "pattern": "cool|daggy"
      }
    }
    "required": ["name"]
  }
}
const data = { id: 123, name: 'garry' }

toFormInputs(schema, data)

// result
{
  id: {
    type: 'text',
    value: 123
  },
  name: {
    type: 'text',
    required: true,
    value: 'garry'
  },
  hair: {
    type: 'text',
    pattern: 'cool|daggy'
  }
}
```
