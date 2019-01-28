import { isString } from 'lodash';

import { fields } from 'reformogen/build/formogen/semantic-ui';

import { asyncFieldOptions, dirtyFieldValue } from '../selectors';

import { connectField } from './reduxFieldFactory';



export const suiFieldComponentMap = {
  GenericField: connectField(fields.GenericField),

  CharField: connectField(fields.CharField),
  TextField: connectField(fields.TextField),
  BooleanField: connectField(fields.BooleanField),
  
  DateField: connectField(fields.DateField),
  DateTimeField: connectField(fields.DateTimeField),
  TimeField: connectField(fields.TimeField),

  IntegerField: connectField(fields.IntegerField),
  FloatField: connectField(fields.IntegerField),
  DecimalField: connectField(fields.IntegerField),
  SmallIntegerField: connectField(fields.IntegerField),
  PositiveIntegerField: connectField(fields.IntegerField),
  PositiveSmallIntegerField: connectField(fields.IntegerField),

  AutocompleteChoiceField: connectField(fields.AutocompleteChoiceField),
  InlineForeignKeyField: connectField(fields.InlineForeignKeyField),
  InlineManyToManyField: connectField(fields.InlineManyToManyField),
  
  AsyncManyToManyField: connectField(fields.AsyncManyToManyField, { options: asyncFieldOptions }),
  AsyncForeignKeyField: connectField(fields.AsyncForeignKeyField, { options: asyncFieldOptions }),

  DropzoneField: connectField(fields.DropzoneField, { value: dirtyFieldValue }),
};

export function getFieldComponentForType({ type, choices, data }) {
  if (choices)
    return suiFieldComponentMap['AutocompleteChoiceField']; 

  if (type === 'FileField') 
    return suiFieldComponentMap.DropzoneField;

  // opts.data can be a string or a list; string treats as a url to DataSet
  if (type === 'ForeignKey' && !isString(data))
    return suiFieldComponentMap.InlineForeignKeyField;

  if (type === 'ForeignKey' && isString(data))
    return suiFieldComponentMap.AsyncForeignKeyField;

  if (type === 'ManyToManyField' && !isString(data))
    return suiFieldComponentMap.InlineManyToManyField;

  if (type === 'ManyToManyField' && isString(data))
    return suiFieldComponentMap.AsyncManyToManyField;

  if(!suiFieldComponentMap[type])
    return suiFieldComponentMap.GenericField;

  return suiFieldComponentMap[type];
}
