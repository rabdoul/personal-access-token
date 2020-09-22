import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import { Sequencing } from './model';

type UIState = {
  editMode: boolean;
  'setup-sequencing'?: Partial<Sequencing>;
};

const InitialState: UIState = {
  editMode: false
};

export type Action = { type: 'TOGGLE_EDIT_MODE' } | { type: 'INIT_SEQUENCING'; sequencing: Sequencing } | { type: 'UPDATE_SEQUENCING'; attribute: keyof Sequencing; value: any };

export const reducer = (state: UIState, action: Action): UIState => {
  switch (action.type) {
    case 'TOGGLE_EDIT_MODE':
      return { editMode: !state.editMode };
    case 'INIT_SEQUENCING':
      return { ...state, 'setup-sequencing': action.sequencing };
    case 'UPDATE_SEQUENCING':
      return {
        ...state,
        'setup-sequencing': {
          ...state['setup-sequencing'],
          [action.attribute]: action.value
        }
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
