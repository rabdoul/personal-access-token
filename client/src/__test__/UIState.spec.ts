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
});
