import 'jest';
import { reducer } from '../UIState';

describe('App.reducer', () => {
  it('should toggle editMode to true', () => {
    const initialState = {
      editMode: false
    };

    expect(reducer(initialState, { type: 'TOGGLE_EDIT_MODE' }).editMode).toBeTruthy();
  });

  it('should toggle editMode to false', () => {
    const initialState = {
      editMode: true,
      'setup-sequencing': {
        splitCommandProducts: true,
        numberOfProductOrders: 5
      }
    };

    expect(reducer(initialState, { type: 'TOGGLE_EDIT_MODE' })).toEqual({ editMode: false });
  });

  it('should init setup sequencing', () => {
    const initialState = {
      editMode: true
    };

    const uiState = reducer(initialState, {
      type: 'INIT_SEQUENCING',
      sequencing: {
        splitCommandProducts: true,
        numberOfProductOrders: 5
      }
    });

    expect(uiState.editMode).toBeTruthy();
    expect(uiState['setup-sequencing']).toEqual({
      splitCommandProducts: true,
      numberOfProductOrders: 5
    });
  });

  it('should update setup-sequencing splitCommandProducts', () => {
    const initialState = {
      editMode: true,
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
    expect(uiState['setup-sequencing']).toEqual({
      splitCommandProducts: true,
      numberOfProductOrders: 5
    });
  });

  it('should update setup-sequencing numberOfProductOrders', () => {
    const initialState = {
      editMode: true,
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
    expect(uiState['setup-sequencing']).toEqual({
      splitCommandProducts: true,
      numberOfProductOrders: 10
    });
  });
});
