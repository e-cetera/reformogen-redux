import { map } from 'lodash';

import * as selectors from './selectors';


const formogenState = {
  'Form:form-3:data': 'sample',

  'Form:form-3:field:id:stored': 1,
  'Form:form-3:field:__urls__:stored': {
    create: 'http://localhost:8000/api/v1/sample/books/',
    read: 'http://localhost:8000/api/v1/sample/books/1/',
    update: 'http://localhost:8000/api/v1/sample/books/1/',
    'delete': 'http://localhost:8000/api/v1/sample/books/1/',
    describe: 'http://localhost:8000/api/v1/sample/books/describe/',
    describe_object: 'http://localhost:8000/api/v1/sample/books/1/describe_object/',
    some_file_field_upload: 'http://url.domain.tld/',
  },
  'Form:form-3:field:dt_created:stored': '2018-10-31T09:43:23.846256Z',
  'Form:form-3:field:dt_modified:stored': '2018-11-16T13:27:57.845005Z',
  'Form:form-3:field:title:stored': 'книжка-то',
  'Form:form-3:field:score:stored': '12.0000',
  'Form:form-3:field:date_published:stored': '2012-02-22',
  'Form:form-3:field:time_published:stored': '11:11:00',
  'Form:form-3:field:preview_sample:stored': 'http://localhost:8000/media/po4ka.jpg',
  'Form:form-3:field:sequence:stored': 1,
  'Form:form-3:field:similar_books_ids:stored': [],
  'Form:form-3:field:author:stored': 1,
  'Form:form-3:metaData': {
    title: 'Edit Book "книжка-то"',
    description: '',
    fields: [
      {
        name: 'author',
        verbose_name: 'author',
        help_text: '',
        blank: false,
        null: false,
        editable: true,
        type: 'ForeignKey',
        required: true,
        data: [
          {
            id: 74,
            name: 'Author 49'
          }
        ]
      },
      {
        name: 'title',
        verbose_name: 'title',
        help_text: '',
        blank: false,
        null: false,
        editable: true,
        max_length: 255,
        type: 'CharField',
        required: true
      },
      {
        name: 'score',
        verbose_name: 'score',
        help_text: '',
        blank: false,
        null: false,
        editable: true,
        decimal_places: 4,
        max_digits: 10,
        type: 'DecimalField',
        required: true
      },
      {
        name: 'date_published',
        verbose_name: 'date published',
        help_text: '',
        blank: false,
        null: false,
        editable: true,
        type: 'DateField',
        required: true
      },
      {
        name: 'time_published',
        verbose_name: 'time published',
        help_text: '',
        blank: false,
        null: false,
        editable: true,
        type: 'TimeField',
        required: true
      },
      {
        name: 'preview_sample',
        verbose_name: 'short preview sample',
        help_text: '',
        blank: true,
        null: false,
        editable: true,
        max_length: 100,
        type: 'FileField',
        required: false,
        multiple: true,
        upload_url: 'http://localhost:8000/api/v1/sample/all/accept_file/'
      },
      {
        name: 'sequence',
        verbose_name: 'author\'s book sequence',
        help_text: '',
        blank: false,
        null: false,
        editable: true,
        type: 'PositiveIntegerField',
        required: true,
        'default': 0
      },
      {
        'name': 'f_m2m_rel',
        'verbose_name': 'related M2M',
        'help_text': '',
        'blank': true,
        'null': false,
        'editable': true,
        'type': 'ManyToManyField',
        'required': false,
        'data': 'http://localhost:8000/api/v1/sample/authors/'
      },
      {
        'name': 'f_fk_rel',
        'verbose_name': 'foreign key with relation',
        'help_text': '',
        'blank': true,
        'null': true,
        'editable': true,
        'type': 'ForeignKey',
        'required': false,
        'data': 'http://localhost:8000/api/v1/sample/books/'
      },
    ]
  },
  'Form:form-3:field:preview_sample:dirty': [
    {
      name: 'IMG_20181118_234425.dng', 
      lastModified: 1542573943761, 
      lastModifiedDate: new Date(), 
      webkitRelativePath: '', 
      size: 31880156,
      type: 'image/x-adobe-dng'
    }
  ],

  'Form:form-3:field:preview_sample_empty:dirty': [],

  'Form:form-3:field:title:dirty': 'new title',

  'Form:form-3:field:field_with_options:q:some search:nextPageNumber': 666,
  'Form:form-3:field:field_with_options:q': 'some search',
  'Form:form-3:field:field_with_options:q:some search:options': [ 'option1' ],
};

const state = {
  formogen: formogenState,
};

describe('selectors', () => {
  it('should select formogen from state', () => expect(
    selectors.formogen(state)
  ).toEqual(state.formogen));

  it('should select props from the second argument', () => expect(
    selectors.props(null, { sample: 1 })
  ).toEqual({ sample: 1 }));

  it('should select the field name', () => expect(
    selectors.fieldName(null, { name: 1 })
  ).toEqual(1));

  it('should select the form identifier', () => expect(
    selectors.formId(null, { formId: 1 })
  ).toEqual(1));

  it('should select metaData', () => expect(
    selectors.metaData(state, { formId: 'form-3' })
  ).toEqual(
    formogenState['Form:form-3:metaData']
  ));

  it('should select metaDataFields', () => expect(
    selectors.metaDataFields(state, { formId: 'form-3' })
  ).toEqual(
    formogenState['Form:form-3:metaData'].fields
  ));

  it('should select non-file fields', () => expect(
    selectors.metaDataNonFileFields(
      state, 
      { formId: 'form-3' }
    ).map(({ name }) => name)
  ).toEqual([ 
    'author',
    'title',
    'score',
    'date_published',
    'time_published',
    'sequence',
    'f_m2m_rel',
    'f_fk_rel',
  ]));

  it('should select metaDataFileFields', () => expect(
    selectors.metaDataFileFields(
      state, 
      { formId: 'form-3' }
    ).map(({ name }) => name)
  ).toEqual([
    'preview_sample'
  ]));

  it('should select metaDataM2MFields', () => expect(
    selectors.metaDataM2MRemoteFields(
      state,
      { formId: 'form-3' }
    ).map(({ name }) => name)
  ).toEqual([
    'f_m2m_rel'
  ]));

  it('should select metaDataFKFields', () => expect(
    selectors.metaDataFKRemoteFields(
      state,
      { formId: 'form-3' }
    ).map(({ name }) => name)
  ).toEqual([
    'f_fk_rel'
  ]));

  it('should select metaDataDefaultsMap', () => expect(
    selectors.metaDataDefaultsMap(
      state,
      { formId: 'form-3' }
    )
  ).toEqual(
    { sequence: 0 }
  ));

  it('should select metaDataFieldsByNameMap', () => expect(
    selectors.metaDataFieldsByNameMap(
      state,
      { formId: 'form-3' }
    ) |> Object.keys
  ).toEqual(
    map(formogenState['Form:form-3:metaData'].fields, 'name')
  ));

  it('should select defaultFieldValue', () => expect(
    selectors.defaultFieldValue(
      state,
      { formId: 'form-3', name: 'sequence' }
    )
  ).toEqual(
    0
  ));

  it('should select storedFieldValue', () => expect(
    selectors.storedFieldValue(
      state,
      { formId: 'form-3', name: 'title' }
    )
  ).toEqual(
    'книжка-то'
  ));

  it('should select dirtyFieldValue', () => expect(
    selectors.dirtyFieldValue(
      state,
      { formId: 'form-3', name: 'title' }
    )
  ).toEqual(
    'new title'
  ));

  it('should select initialFieldValue', () => expect(
    selectors.initialFieldValue(
      state,
      { formId: 'form-3', name: 'title' }
    )
  ).toEqual('книжка-то'));

  it('should select initialFieldValue [empty string]', () => expect(
    selectors.initialFieldValue(
      state,
      { formId: 'form-3', name: 'sample-unique' }
    )
  ).toEqual(''));

  it('should select finalFieldValue', () => expect(
    selectors.finalFieldValue(
      state,
      { formId: 'form-3', name: 'title' }
    )
  ).toEqual(
    'new title'
  ));
  
  it('should select fieldOptionsNextPageNumber', () => expect(
    selectors.fieldOptionsNextPageNumber(
      state,
      { formId: 'form-3', name: 'field_with_options' }
    )
  ).toEqual(
    666
  ));

  it('should select asyncFieldInputSearch', () => expect(
    selectors.asyncFieldInputSearch(
      state,
      { formId: 'form-3', name: 'field_with_options' }
    )
  ).toEqual(
    'some search'
  ));

  it('should select asyncFieldOptions', () => expect(
    selectors.asyncFieldOptions(
      state,
      { formId: 'form-3', name: 'field_with_options' }
    )
  ).toEqual(
    [ 'option1' ]
  ));

  it('should select objectUrls', () => expect(
    selectors.objectUrls(
      state,
      { formId: 'form-3' }
    )
  ).toEqual(
    formogenState['Form:form-3:field:__urls__:stored']
  ));

  it('should select fieldFileUploadUrl from __urls__', () => expect(
    selectors.fieldFileUploadUrl(
      state,
      { formId: 'form-3', name: 'some_file_field' }
    )
  ).toEqual(
    'http://url.domain.tld/'
  ));

  it('should select fieldFileUploadUrl from metaData', () => expect(
    selectors.fieldFileUploadUrl(
      state,
      { formId: 'form-3', name: 'preview_sample' }
    )
  ).toEqual(
    'http://localhost:8000/api/v1/sample/all/accept_file/'
  ));

  it('should select finalFormData', () => expect(
    selectors.finalFormData(
      state,
      { formId: 'form-3' }
    )
  ).toEqual({
    author: 1, 
    date_published: '2012-02-22', 
    f_fk_rel: undefined, 
    f_m2m_rel: undefined, 
    score: '12.0000', 
    sequence: 1, 
    time_published: '11:11:00', 
    title: 'new title'
  }));

  it('should select dirtyFormFiles', () => expect(
    selectors.dirtyFormFiles(
      state,
      { formId: 'form-3' }
    )
  ).toHaveLength(1));
  
  it('should select PUT with formSaveHTTPMethod if there was an object id specified', () => expect(
    selectors.formSaveHTTPMethod(
      { formogen: { 'Form:FORMID:field:id:stored': 1 } },
      { formId: 'FORMID' }
    )
  ).toEqual('put'));

  it('should select POST with formSaveHTTPMethod if there was no object is specified', () => expect(
    selectors.formSaveHTTPMethod(
      { formogen: { 'Form:FORMID:field:id:stored': undefined } },
      { formId: 'FORMID' }
    )
  ).toEqual('post'));

  it('should select formSaveUrl if there was an object id specified', () => expect(
    selectors.formSaveUrl(
      { formogen: { 'Form:FORMID:field:id:stored': 1 } },
      { formId: 'FORMID', objectUrl: 'http://sample-object-url.test' }
    )
  ).toEqual('http://sample-object-url.test'));

  it('should select formSaveUrl if there was no object id specified', () => expect(
    selectors.formSaveUrl(
      { formogen: { 'Form:FORMID:field:id:stored': undefined } },
      { formId: 'FORMID', createUrl: 'http://sample-object-create-url.test' }
    )
  ).toEqual('http://sample-object-create-url.test'));


  it('should select describeUrl', () => expect(
    selectors.describeUrl(
      state,
      { formId: 'form-3' }
    )
  ).toEqual(
    'http://localhost:8000/api/v1/sample/books/1/describe_object/'
  ));

  it('should select metaDataFieldNames', () => expect(
    selectors.metaDataFieldNames(
      state,
      { formId: 'form-3' }
    )
  ).toEqual([ 
    'author',
    'title',
    'score',
    'date_published',
    'time_published',
    'preview_sample',
    'sequence',
    'f_m2m_rel',
    'f_fk_rel',
  ]));

  it('should select formData', () => expect(
    selectors.formData(
      state,
      { formId: 'form-3' }
    )
  ).toEqual('sample'));

  it('should select fieldErrors', () => expect(
    selectors.fieldErrors(
      { formogen: { 'Form:FORMID:fieldErrors': { FIELD: 1 } } },
      { formId: 'FORMID', name: 'FIELD' },
    )
  ).toEqual(1));

  it('should select legacyNonFieldErrorsMap', () => expect(
    selectors.legacyNonFieldErrorsMap(
      { formogen: { 'Form:FORMID:nonFieldErrors': 1 } },
      { formId: 'FORMID' },
    )
  ).toEqual(1));

  it('should select fieldOptionsCurrentPageNumber', () => expect(
    selectors.fieldOptionsCurrentPageNumber(
      { 
        formogen: { 
          'Form:FORMID:field:FIELD:q::currentPageNumber': 1,
          'Form:FORMID:field:FIELD:q': '',
        } 
      },
      { formId: 'FORMID', name: 'FIELD' },
    )
  ).toEqual(1));
});
