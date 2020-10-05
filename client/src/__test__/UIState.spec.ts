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
      editedRules: new Set()
    };

    expect(reducer(initialState, { type: 'TOGGLE_EDIT_MODE' })).toEqual({
      editMode: true,
      editedRules: new Set()
    });
  });

  it('should toggle editMode to false', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: new Set(['setup-sequencing']),
      invalidRules: EMPTY_INVALID_RULES,
      'setup-sequencing': {
        splitCommandProducts: true
      }
    };

    expect(reducer(initialState, { type: 'TOGGLE_EDIT_MODE' })).toEqual({ editMode: false, editedRules: new Set() });
  });

  it('should reset editMode', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: new Set(['setup-sequencing']),
      invalidRules: EMPTY_INVALID_RULES,
      'setup-sequencing': {
        splitCommandProducts: true
      }
    };

    expect(reducer(initialState, { type: 'RESET_EDIT_MODE' })).toEqual({
      editMode: true,
      editedRules: new Set()
    });
  });

  describe('setup sequencing', () => {
    it('should init setup sequencing', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set()
      };

      const uiState = reducer(initialState, {
        type: 'INIT_SEQUENCING',
        sequencing: {
          splitCommandProducts: true,
          numberOfProductOrders: 5
        }
      });

      expect(uiState.editMode).toBeTruthy();
      expect(uiState.editedRules.size).toBe(0);
      expect(uiState.invalidRules).toEqual({ 'setup-sequencing': new Set() });
      expect(uiState['setup-sequencing']).toEqual({
        splitCommandProducts: true,
        numberOfProductOrders: 5
      });
    });

    it('should update setup-sequencing splitCommandProducts', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(['setup-sequencing']),
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
      expect(uiState.editedRules).toContainEqual('setup-sequencing');
      expect(uiState.invalidRules).toEqual(EMPTY_INVALID_RULES);
      expect(uiState['setup-sequencing']).toEqual({
        splitCommandProducts: true,
        numberOfProductOrders: 5
      });
    });

    it('should update setup-sequencing numberOfProductOrders', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(),
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
      expect(uiState.editedRules).toContainEqual('setup-sequencing');
      expect(uiState.invalidRules).toEqual(EMPTY_INVALID_RULES);
      expect(uiState['setup-sequencing']).toEqual({
        splitCommandProducts: true,
        numberOfProductOrders: 10
      });
    });

    it('should update setup-sequencing numberOfProductOrders with empty value', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(),
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
      expect(uiState.editedRules).toContainEqual('setup-sequencing');
      expect(uiState.invalidRules).toEqual({ ...EMPTY_INVALID_RULES, 'setup-sequencing': new Set(['numberOfProductOrders']) });
      expect(uiState['setup-sequencing']).toEqual({
        splitCommandProducts: true
      });
    });

    it('should keep edited rules on update of another rule', () => {
      const initialState: UIState = {
        editMode: true,
        invalidRules: EMPTY_INVALID_RULES,
        editedRules: new Set(['validate-mtm-product'])
      };

      const uiState = reducer(initialState, {
        type: 'UPDATE_SEQUENCING',
        attribute: 'numberOfProductOrders',
        value: 3,
        isValid: true
      });

      expect(uiState.editedRules).toEqual(new Set(['validate-mtm-product', 'setup-sequencing']));
    });
  });

  describe('validate mtm product', () => {
    it('should init validate mtm product', () => {
      const initialState: UIState = {
        editMode: false,
        editedRules: new Set()
      };

      const uiState = reducer(initialState, {
        type: 'INIT_VALIDATE_MTM_PRODUCT',
        validateMTMProduct: {
          stopOnOutOfRangeWarning: true,
          stopOnIncorrectValueWarning: false
        }
      });

      expect(uiState.editMode).toBeFalsy();
      expect(uiState.editedRules.size).toBe(0);
      expect(uiState['validate-mtm-product']).toEqual({
        stopOnOutOfRangeWarning: true,
        stopOnIncorrectValueWarning: false
      });
    });

    it('should update validate-mtm-product stopOnOutOfRangeWarning', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(),
        invalidRules: EMPTY_INVALID_RULES,
        'validate-mtm-product': {
          stopOnOutOfRangeWarning: true,
          stopOnIncorrectValueWarning: false
        }
      };

      const uiState = reducer(initialState, {
        type: 'UPDATE_VALIDATE_MTM_PRODUCT',
        attribute: 'stopOnOutOfRangeWarning',
        value: false,
        isValid: true
      });

      expect(uiState.editMode).toBeTruthy();
      expect(uiState.editedRules).toContainEqual('validate-mtm-product');
      expect(uiState.invalidRules).toEqual(EMPTY_INVALID_RULES);
      expect(uiState['validate-mtm-product']).toEqual({
        stopOnOutOfRangeWarning: false,
        stopOnIncorrectValueWarning: false
      });
    });

    it('should update validate-mtm-product stopOnIncorrectValueWarning', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(),
        invalidRules: EMPTY_INVALID_RULES,
        'validate-mtm-product': {
          stopOnOutOfRangeWarning: true,
          stopOnIncorrectValueWarning: false
        }
      };

      const uiState = reducer(initialState, {
        type: 'UPDATE_VALIDATE_MTM_PRODUCT',
        attribute: 'stopOnIncorrectValueWarning',
        value: true,
        isValid: true
      });

      expect(uiState.editMode).toBeTruthy();
      expect(uiState.editedRules).toContainEqual('validate-mtm-product');
      expect(uiState.invalidRules).toEqual(EMPTY_INVALID_RULES);
      expect(uiState['validate-mtm-product']).toEqual({
        stopOnOutOfRangeWarning: true,
        stopOnIncorrectValueWarning: true
      });
    });

    it('should keep edited rules on update of another rule', () => {
      const initialState: UIState = {
        editMode: true,
        editedRules: new Set(['setup-sequencing'])
      };

      const uiState = reducer(initialState, {
        type: 'UPDATE_VALIDATE_MTM_PRODUCT',
        attribute: 'stopOnOutOfRangeWarning',
        value: false,
        isValid: true
      });

      expect(uiState.editedRules).toEqual(new Set(['setup-sequencing', 'validate-mtm-product']));
    });
  });
});
