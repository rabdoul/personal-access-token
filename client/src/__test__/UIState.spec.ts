import 'jest';
import { reducer, RuleId, UIState } from '../UIState';

describe('App.reducer', () => {
  const EMPTY_INVALID_RULES = {
    'setup-sequencing': new Set<string>(),
    'validate-mtm-product': new Set<string>()
  };

  it('should toggle editMode to true', () => {
    const initialState: UIState = {
      editMode: false,
      editedRules: []
    };

    expect(reducer(initialState, { type: 'TOGGLE_EDIT_MODE' })).toEqual({
      editMode: true,
      editedRules: []
    });
  });

  it('should toggle editMode to false', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: ['setup-sequencing'],
      invalidRules: EMPTY_INVALID_RULES,
      'setup-sequencing': {
        splitCommandProducts: true
      }
    };

    expect(reducer(initialState, { type: 'TOGGLE_EDIT_MODE' })).toEqual({ editMode: false, editedRules: [] });
  });

  it('should reset editMode', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: ['setup-sequencing'],
      invalidRules: EMPTY_INVALID_RULES,
      'setup-sequencing': {
        splitCommandProducts: true
      }
    };

    expect(reducer(initialState, { type: 'RESET_EDIT_MODE' })).toEqual({
      editMode: true,
      editedRules: []
    });
  });

  it('should init setup sequencing', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: []
    };

    const uiState = reducer(initialState, {
      type: 'INIT_SEQUENCING',
      sequencing: {
        splitCommandProducts: true,
        numberOfProductOrders: 5
      }
    });

    expect(uiState.editMode).toBeTruthy();
    expect(uiState.editedRules.length).toBe(0);
    expect(uiState.invalidRules).toEqual({ 'setup-sequencing': new Set() });
    expect(uiState['setup-sequencing']).toEqual({
      splitCommandProducts: true,
      numberOfProductOrders: 5
    });
  });

  it('should update setup-sequencing splitCommandProducts', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: [],
      invalidRules: EMPTY_INVALID_RULES,
      'setup-sequencing': {
        splitCommandProducts: false,
        numberOfProductOrders: 5
      }
    };

    const uiState = reducer(initialState, {
      type: 'UPDATE_SEQUENCING',
      attribute: 'splitCommandProducts',
      value: true,
      isValid: true
    });

    expect(uiState.editMode).toBeTruthy();
    expect(uiState.editedRules).toEqual(['setup-sequencing']);
    expect(uiState.invalidRules).toEqual(EMPTY_INVALID_RULES);
    expect(uiState['setup-sequencing']).toEqual({
      splitCommandProducts: true,
      numberOfProductOrders: 5
    });
  });

  it('should update setup-sequencing numberOfProductOrders', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: [],
      invalidRules: EMPTY_INVALID_RULES,
      'setup-sequencing': {
        splitCommandProducts: true,
        numberOfProductOrders: 5
      }
    };

    const uiState = reducer(initialState, {
      type: 'UPDATE_SEQUENCING',
      attribute: 'numberOfProductOrders',
      value: 10,
      isValid: true
    });

    expect(uiState.editMode).toBeTruthy();
    expect(uiState.editedRules).toEqual(['setup-sequencing']);
    expect(uiState.invalidRules).toEqual(EMPTY_INVALID_RULES);
    expect(uiState['setup-sequencing']).toEqual({
      splitCommandProducts: true,
      numberOfProductOrders: 10
    });
  });

  it('should update setup-sequencing numberOfProductOrders with empty value', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: [],
      invalidRules: EMPTY_INVALID_RULES,
      'setup-sequencing': {
        splitCommandProducts: true,
        numberOfProductOrders: 5
      }
    };

    const uiState = reducer(initialState, {
      type: 'UPDATE_SEQUENCING',
      attribute: 'numberOfProductOrders',
      value: undefined,
      isValid: false
    });

    expect(uiState.editMode).toBeTruthy();
    expect(uiState.editedRules).toEqual(['setup-sequencing']);
    expect(uiState.invalidRules).toEqual({ ...EMPTY_INVALID_RULES, 'setup-sequencing': setOf('numberOfProductOrders') });
    expect(uiState['setup-sequencing']).toEqual({
      splitCommandProducts: true
    });
  });

  it('should init validate mtm product', () => {
    const initialState: UIState = {
      editMode: false,
      editedRules: []
    };

    const uiState = reducer(initialState, {
      type: 'INIT_VALIDATE_MTM_PRODUCT',
      validateMTMProduct: {
        stopOnOutOfRangeWarning: true,
        stopOnIncorrectValueWarning: false
      }
    });

    expect(uiState.editMode).toBeFalsy();
    expect(uiState.editedRules.length).toBe(0);
    expect(uiState['validate-mtm-product']).toEqual({
      stopOnOutOfRangeWarning: true,
      stopOnIncorrectValueWarning: false
    });
  });
});

function setOf(value: string) {
  const set = new Set();
  set.add(value);
  return set;
}
