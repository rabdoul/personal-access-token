import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';

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
