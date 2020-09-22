import 'jest';
import { reducer } from '../UIState';

describe('App.reducer', () => {
  it('should toggle editMode to true', () => {
    const initialState = {
      editMode: false
    };

    expect(reducer(initialState, 'TOGGLE_EDIT_MODE').editMode).toBeTruthy();
  });

  it('should toggle editMode to false', () => {
    const initialState = {
      editMode: true
    };

    expect(reducer(initialState, 'TOGGLE_EDIT_MODE').editMode).toBeFalsy();
  });
});
