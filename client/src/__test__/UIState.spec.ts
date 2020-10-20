import 'jest';
import { reducer, UIState } from '../UIState';

describe('UIState', () => {
  it('should toggle editMode to true', () => {
    const initialState: UIState = {
      editMode: false,
      editedRules: new Set(),
      invalidRules: new Set()
    };

    expect(reducer(initialState, { type: 'TOGGLE_EDIT_MODE' })).toEqual({
      editMode: true,
      editedRules: new Set(),
      invalidRules: new Set()
    });
  });

  it('should toggle editMode to false', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: new Set(['setup-sequencing']),
      invalidRules: new Set(),
      'setup-sequencing': []
    };

    expect(reducer(initialState, { type: 'TOGGLE_EDIT_MODE' })).toEqual({ editMode: false, editedRules: new Set(), invalidRules: new Set() });
  });

  it('should reset editMode', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: new Set(['setup-sequencing']),
      invalidRules: new Set(),
      'setup-sequencing': []
    };

    expect(reducer(initialState, { type: 'RESET_EDIT_MODE' })).toEqual({
      editMode: true,
      editedRules: new Set(),
      invalidRules: new Set()
    });
  });

  it('should add statement', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: new Set(),
      invalidRules: new Set(),
      'validate-mtm-product': [
        {
          conditions: [],
          result: {
            stopOnOutOfRangeWarning: true,
            stopOnIncorrectValueWarning: true
          }
        }
      ]
    };

    const uiState = reducer(initialState, {
      type: 'ADD_STATEMENT',
      activityId: 'validate-mtm-product'
    });

    expect(uiState.editedRules.has('validate-mtm-product')).toBeTruthy();
    expect(uiState['validate-mtm-product']).toEqual([
      {
        conditions: [{}],
        result: {}
      },
      {
        conditions: [],
        result: {
          stopOnOutOfRangeWarning: true,
          stopOnIncorrectValueWarning: true
        }
      }
    ]);
  });

  it('should add condition', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: new Set(),
      invalidRules: new Set(),
      'validate-mtm-product': [
        {
          conditions: [{}, {}],
          result: {
            stopOnOutOfRangeWarning: true,
            stopOnIncorrectValueWarning: true
          }
        }
      ]
    };

    const uiState = reducer(initialState, {
      type: 'ADD_CONDITION',
      activityId: 'validate-mtm-product',
      statementIndex: 0,
      conditionIndex: 1
    });

    expect(uiState.editedRules.has('validate-mtm-product')).toBeTruthy();
    expect(uiState['validate-mtm-product']).toEqual([
      {
        conditions: [{}, {}, {}],
        result: {
          stopOnOutOfRangeWarning: true,
          stopOnIncorrectValueWarning: true
        }
      }
    ]);
  });

  it('should update condition', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: new Set(),
      invalidRules: new Set(),
      'validate-mtm-product': [
        { conditions: [{}], result: {} },
        { conditions: [], result: {} }
      ]
    };

    let state = reducer(initialState, {
      type: 'UPDATE_CONDITION',
      activityId: 'validate-mtm-product',
      statementIndex: 0,
      conditionIndex: 0,
      attribute: 'reference',
      value: 'command.reference'
    });

    expect(state.editedRules.has('validate-mtm-product')).toBeTruthy();
    expect(state['validate-mtm-product']).toEqual([
      { conditions: [{ reference: 'command.reference' }], result: {} },
      { conditions: [], result: {} }
    ]);

    state = reducer(state, {
      type: 'UPDATE_CONDITION',
      activityId: 'validate-mtm-product',
      statementIndex: 0,
      conditionIndex: 0,
      attribute: 'operator',
      value: 'Equal'
    });

    expect(state['validate-mtm-product']).toEqual([
      { conditions: [{ reference: 'command.reference', operator: 'Equal' }], result: {} },
      { conditions: [], result: {} }
    ]);

    state = reducer(state, {
      type: 'UPDATE_CONDITION',
      activityId: 'validate-mtm-product',
      statementIndex: 0,
      conditionIndex: 0,
      attribute: 'reference',
      value: 'command.priority'
    });

    expect(state['validate-mtm-product']).toEqual([
      { conditions: [{ reference: 'command.priority' }], result: {} },
      { conditions: [], result: {} }
    ]);
  });

  it('should delete condition', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: new Set(),
      invalidRules: new Set(),
      'validate-mtm-product': [
        {
          conditions: [{}, {}],
          result: {}
        },
        {
          conditions: [],
          result: {}
        }
      ]
    };

    const uiState = reducer(initialState, {
      type: 'DELETE_CONDITION',
      activityId: 'validate-mtm-product',
      statementIndex: 0,
      conditionIndex: 1
    });

    expect(uiState.editedRules.has('validate-mtm-product')).toBeTruthy();
    expect(uiState['validate-mtm-product']).toEqual([
      {
        conditions: [{}],
        result: {}
      },
      {
        conditions: [],
        result: {}
      }
    ]);
  });

  it('should delete statement if first condition is deleted', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: new Set(),
      invalidRules: new Set(),
      'validate-mtm-product': [
        {
          conditions: [{}, {}],
          result: {}
        },
        {
          conditions: [],
          result: {}
        }
      ]
    };

    const uiState = reducer(initialState, {
      type: 'DELETE_CONDITION',
      activityId: 'validate-mtm-product',
      statementIndex: 0,
      conditionIndex: 0
    });

    expect(uiState['validate-mtm-product']).toEqual([
      {
        conditions: [],
        result: {}
      }
    ]);
  });

  it('should invalidate rule', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: new Set(['setup-sequencing']),
      invalidRules: new Set(),
      'setup-sequencing': [{ conditions: [], result: {} }]
    };
    expect(reducer(initialState, { type: 'INVALIDATE_RULE', activityId: 'setup-sequencing' }).invalidRules).toEqual(new Set(['setup-sequencing']));
  });

  it('should validate rule', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: new Set(['setup-sequencing']),
      invalidRules: new Set(['setup-sequencing']),
      'setup-sequencing': [{ conditions: [], result: { splitList: true, firstSubListSize: 7 } }]
    };
    expect(reducer(initialState, { type: 'VALIDATE_RULE', activityId: 'setup-sequencing' }).invalidRules.size).toBe(0);
  });

  describe('setup sequencing', () => {
    it('should init setup sequencing', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(),
        invalidRules: new Set()
      };

      const uiState = reducer(initialState, {
        type: 'INIT_RULE',
        activityId: 'setup-sequencing',
        rule: [
          {
            conditions: [],
            result: {
              splitList: true,
              firstSubListSize: 5
            }
          }
        ]
      });

      expect(uiState.editMode).toBeTruthy();
      expect(uiState.editedRules.size).toBe(0);
      expect(uiState['setup-sequencing']).toEqual([
        {
          conditions: [],
          result: {
            splitList: true,
            firstSubListSize: 5
          }
        }
      ]);
    });

    it('should update setup-sequencing splitList', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(['setup-sequencing']),
        invalidRules: new Set(),
        'setup-sequencing': [
          {
            conditions: [],
            result: {
              splitList: false,
              firstSubListSize: 5
            }
          }
        ]
      };

      const uiState = reducer(initialState, {
        type: 'UPDATE_STATEMENT_RESULT',
        activityId: 'setup-sequencing',
        attribute: 'splitList',
        value: true,
        statementIndex: 0
      });

      expect(uiState.editMode).toBeTruthy();
      expect(uiState.editedRules).toContainEqual('setup-sequencing');
      expect(uiState['setup-sequencing']).toEqual([
        {
          conditions: [],
          result: {
            splitList: true,
            firstSubListSize: 5
          }
        }
      ]);
    });

    it('should update setup-sequencing firstSubListSize', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(),
        invalidRules: new Set(),
        'setup-sequencing': [
          {
            conditions: [],
            result: {
              splitList: true,
              firstSubListSize: 5
            }
          }
        ]
      };

      const uiState = reducer(initialState, {
        type: 'UPDATE_STATEMENT_RESULT',
        activityId: 'setup-sequencing',
        attribute: 'firstSubListSize',
        value: 10,
        statementIndex: 0
      });

      expect(uiState.editMode).toBeTruthy();
      expect(uiState.editedRules).toContainEqual('setup-sequencing');
      expect(uiState['setup-sequencing']).toEqual([
        {
          conditions: [],
          result: {
            splitList: true,
            firstSubListSize: 10
          }
        }
      ]);
    });

    it('should update setup-sequencing firstSubListSize with empty value', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(),
        invalidRules: new Set(),
        'setup-sequencing': [
          {
            conditions: [],
            result: {
              splitList: true,
              firstSubListSize: 5
            }
          }
        ]
      };

      const uiState = reducer(initialState, {
        type: 'UPDATE_STATEMENT_RESULT',
        activityId: 'setup-sequencing',
        attribute: 'firstSubListSize',
        value: undefined,
        statementIndex: 0
      });

      expect(uiState.editMode).toBeTruthy();
      expect(uiState.editedRules).toContainEqual('setup-sequencing');
      expect(uiState['setup-sequencing']).toEqual([
        {
          conditions: [],
          result: {
            splitList: true
          }
        }
      ]);
    });

    it('should keep edited rules on update of another rule', () => {
      const initialState: UIState = {
        editMode: true,
        invalidRules: new Set(),
        editedRules: new Set(['validate-mtm-product']),
        'setup-sequencing': [
          {
            conditions: [],
            result: {
              splitList: true,
              firstSubListSize: 5
            }
          }
        ]
      };

      const uiState = reducer(initialState, {
        type: 'UPDATE_STATEMENT_RESULT',
        activityId: 'setup-sequencing',
        attribute: 'firstSubListSize',
        value: 3,
        statementIndex: 0
      });

      expect(uiState.editedRules).toEqual(new Set(['validate-mtm-product', 'setup-sequencing']));
    });
  });

  describe('validate mtm product', () => {
    it('should init validate mtm product', () => {
      const initialState: UIState = {
        editMode: false,
        editedRules: new Set(),
        invalidRules: new Set()
      };

      const uiState = reducer(initialState, {
        type: 'INIT_RULE',
        activityId: 'validate-mtm-product',
        rule: [
          {
            conditions: [],
            result: {
              stopOnOutOfRangeWarning: true,
              stopOnIncorrectValueWarning: false
            }
          }
        ]
      });

      expect(uiState.editMode).toBeFalsy();
      expect(uiState.editedRules.size).toBe(0);
      expect(uiState['validate-mtm-product']).toEqual([
        {
          conditions: [],
          result: {
            stopOnOutOfRangeWarning: true,
            stopOnIncorrectValueWarning: false
          }
        }
      ]);
    });

    it('should update validate-mtm-product stopOnOutOfRangeWarning', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(),
        invalidRules: new Set(),
        'validate-mtm-product': [
          {
            conditions: [],
            result: {
              stopOnOutOfRangeWarning: true,
              stopOnIncorrectValueWarning: false
            }
          }
        ]
      };

      const uiState = reducer(initialState, {
        type: 'UPDATE_STATEMENT_RESULT',
        activityId: 'validate-mtm-product',
        attribute: 'stopOnOutOfRangeWarning',
        value: false,
        statementIndex: 0
      });

      expect(uiState.editMode).toBeTruthy();
      expect(uiState.editedRules).toContainEqual('validate-mtm-product');
      expect(uiState['validate-mtm-product']).toEqual([
        {
          conditions: [],
          result: {
            stopOnOutOfRangeWarning: false,
            stopOnIncorrectValueWarning: false
          }
        }
      ]);
    });

    it('should keep edited rules on update of another rule', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(['setup-sequencing']),
        invalidRules: new Set(),

        'validate-mtm-product': [
          {
            conditions: [],
            result: {
              stopOnOutOfRangeWarning: true,
              stopOnIncorrectValueWarning: false
            }
          }
        ]
      };

      const uiState = reducer(initialState, {
        type: 'UPDATE_STATEMENT_RESULT',
        activityId: 'validate-mtm-product',
        attribute: 'stopOnOutOfRangeWarning',
        value: false,
        statementIndex: 0
      });

      expect(uiState.editedRules).toEqual(new Set(['setup-sequencing', 'validate-mtm-product']));
    });
  });

  describe('generate batch', () => {
    it('should add criteria', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(['generate-batch']),
        invalidRules: new Set(),
        'generate-batch': [
          {
            conditions: [],
            result: {
              batchGenerationType: 1,
              useMaxNumberOfOrder: true,
              maxNumberOfOrders: 100
            }
          }
        ]
      };

      const uiState = reducer(initialState, {
        type: 'ADD_CRITERIA_GENERATE_BATCH',
        statementIndex: 0
      });

      expect(uiState['generate-batch']).toEqual([
        {
          conditions: [],
          result: {
            batchGenerationType: 1,
            useMaxNumberOfOrder: true,
            maxNumberOfOrders: 100,
            criterions: [{}]
          }
        }
      ]);
    });

    it('should remove all criterions', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(['generate-batch']),
        invalidRules: new Set(),
        'generate-batch': [
          {
            conditions: [],
            result: {
              batchGenerationType: 1,
              useMaxNumberOfOrder: true,
              maxNumberOfOrders: 100,
              criterions: [
                {
                  batchGenerationCriterionType: 0,
                  componentCategory: 'A',
                  componentMaterialUsage: 'B',
                  isContrast: true
                },
                {
                  batchGenerationCriterionType: 1
                }
              ]
            }
          }
        ]
      };

      const uiState = reducer(initialState, {
        type: 'REMOVE_ALL_CRITERIONS_GENERATE_BATCH',
        statementIndex: 0
      });

      expect(uiState['generate-batch']).toEqual([
        {
          conditions: [],
          result: {
            batchGenerationType: 1,
            useMaxNumberOfOrder: true,
            maxNumberOfOrders: 100,
            criterions: null
          }
        }
      ]);
    });
  });
});
