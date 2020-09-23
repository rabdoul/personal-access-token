import 'jest';
import { reducer, UIState } from '../UIState';

describe('App.reducer', () => {
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
      'setup-sequencing': {
        splitCommandProducts: true,
        numberOfProductOrders: 5
      }
    };

    expect(reducer(initialState, { type: 'TOGGLE_EDIT_MODE' })).toEqual({ editMode: false, editedRules: [] });
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
    expect(uiState['setup-sequencing']).toEqual({
      splitCommandProducts: true,
      numberOfProductOrders: 5
    });
  });

  it('should update setup-sequencing splitCommandProducts', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: [],
      'setup-sequencing': {
        splitCommandProducts: false,
        numberOfProductOrders: 5
      }
    };

    const uiState = reducer(initialState, {
      type: 'UPDATE_SEQUENCING',
      attribute: 'splitCommandProducts',
      value: true
    });

    expect(uiState.editMode).toBeTruthy();
    expect(uiState.editedRules).toEqual(['setup-sequencing']);
    expect(uiState['setup-sequencing']).toEqual({
      splitCommandProducts: true,
      numberOfProductOrders: 5
    });
  });

  it('should update setup-sequencing numberOfProductOrders', () => {
    const initialState: UIState = {
      editMode: true,
      editedRules: [],
      'setup-sequencing': {
        splitCommandProducts: true,
        numberOfProductOrders: 5
      }
    };

    const uiState = reducer(initialState, {
      type: 'UPDATE_SEQUENCING',
      attribute: 'numberOfProductOrders',
      value: 10
    });

    expect(uiState.editMode).toBeTruthy();
    expect(uiState.editedRules).toEqual(['setup-sequencing']);
    expect(uiState['setup-sequencing']).toEqual({
      splitCommandProducts: true,
      numberOfProductOrders: 10
    });
  });
});
