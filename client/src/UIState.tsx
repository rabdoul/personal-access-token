import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import { Sequencing, ValidateMTMProduct } from './model';

export type ActivityId = keyof Omit<UIState, 'editedRules' | 'editMode' | 'invalidRules'>;

export type UIState = {
  editMode: boolean;
  editedRules: Set<ActivityId>;
  invalidRules?: Record<ActivityId, Set<string>>;
  'setup-sequencing'?: Partial<Sequencing>;
  'validate-mtm-product'?: Partial<ValidateMTMProduct>;
};

const InitialState: UIState = {
  editMode: false,
  editedRules: new Set()
};

export type Action =
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'RESET_EDIT_MODE' }
  | { type: 'INIT_SEQUENCING'; sequencing: Sequencing }
  | { type: 'UPDATE_SEQUENCING'; attribute: keyof Sequencing; value: any; isValid: boolean }
  | { type: 'INIT_VALIDATE_MTM_PRODUCT'; validateMTMProduct: ValidateMTMProduct }
  | { type: 'UPDATE_VALIDATE_MTM_PRODUCT'; attribute: keyof ValidateMTMProduct; value: any; isValid: boolean };

export const reducer = (state: UIState, action: Action): UIState => {
  switch (action.type) {
    case 'TOGGLE_EDIT_MODE':
      return { editMode: !state.editMode, editedRules: new Set() };

    case 'RESET_EDIT_MODE':
      return { editMode: state.editMode, editedRules: new Set() };

    case 'INIT_SEQUENCING':
      const invalidRules = { ...state.invalidRules, 'setup-sequencing': new Set() } as Record<ActivityId, Set<string>>;
      return { ...state, 'setup-sequencing': action.sequencing, invalidRules };

    case 'UPDATE_SEQUENCING':
      let updatedInvalidRules = { ...state.invalidRules } as Record<ActivityId, Set<string>>;
      if (action.isValid) {
        updatedInvalidRules['setup-sequencing'].delete(action.attribute);
      } else {
        updatedInvalidRules['setup-sequencing'].add(action.attribute);
      }
      return {
        ...state,
        editedRules: new Set([...state.editedRules, 'setup-sequencing']),
        invalidRules: updatedInvalidRules,
        'setup-sequencing': {
          ...state['setup-sequencing'],
          [action.attribute]: action.value
        }
      };

    case 'INIT_VALIDATE_MTM_PRODUCT':
      return { ...state, 'validate-mtm-product': action.validateMTMProduct };

    case 'UPDATE_VALIDATE_MTM_PRODUCT':
      return {
        ...state,
        editedRules: new Set([...state.editedRules, 'validate-mtm-product']),
        'validate-mtm-product': { ...state['validate-mtm-product'], [action.attribute]: action.value }
      };
  }
};

export const UIStateContext = createContext<[UIState, Dispatch<Action>]>([InitialState, (_: Action) => {}]);

export const UIStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, InitialState);
  return <UIStateContext.Provider value={[state, dispatch]}>{children}</UIStateContext.Provider>;
};

export const useUIState = () => {
  const [state] = useContext(UIStateContext);
  return state;
};

export const useUIDispatch = () => {
  const [, dispatch] = useContext(UIStateContext);
  return dispatch;
};

export const useUIStateContext = () => {
  return useContext(UIStateContext);
};
