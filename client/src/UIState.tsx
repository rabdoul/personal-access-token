import React, { createContext, Dispatch, ReactNode, useReducer } from 'react';

const InitialState = {
  editMode: false
};

type UIState = {
  editMode: boolean;
};

export type Action = 'TOGGLE_EDIT_MODE';

export const reducer = (state: UIState, action: Action) => {
  return { editMode: !state.editMode };
};

const UIStateContext = createContext<[UIState, Dispatch<Action>]>([InitialState, (_: Action) => {}]);

export const UIStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, InitialState);
  return <UIStateContext.Provider value={[state, dispatch]}>{children}</UIStateContext.Provider>;
};
