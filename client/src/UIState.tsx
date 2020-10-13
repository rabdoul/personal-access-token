import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import produce, { enableMapSet } from 'immer';

import { Condition, ActivityRule, Sequencing, ValidateMTMProduct, AssociateCuttingRequirements, StatementResult } from './model';

export type ActivityId = keyof Omit<UIState, 'editedRules' | 'editMode' | 'invalidRules'>;

export type UIState = {
  editMode: boolean;
  editedRules: Set<ActivityId>;
  invalidRules: Set<ActivityId>;
  'setup-sequencing'?: ActivityRule<Sequencing>;
  'validate-mtm-product'?: ActivityRule<ValidateMTMProduct>;
  'associate-cutting-requirements'?: ActivityRule<AssociateCuttingRequirements>;
};

const InitialState: UIState = {
  editMode: false,
  editedRules: new Set(),
  invalidRules: new Set()
};

export type Action =
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'RESET_EDIT_MODE' }
  | { type: 'INIT_RULE'; activityId: ActivityId; rule: ActivityRule<StatementResult> }
  | { type: 'UPDATE_SEQUENCING'; attribute: keyof Sequencing; value: any; statementIndex: number }
  | { type: 'UPDATE_VALIDATE_MTM_PRODUCT'; attribute: keyof ValidateMTMProduct; value: any; statementIndex: number }
  | { type: 'ADD_STATEMENT'; activityId: ActivityId }
  | { type: 'ADD_CONDITION'; activityId: ActivityId; statementIndex: number; conditionIndex: number }
  | { type: 'UPDATE_CONDITION'; activityId: ActivityId; statementIndex: number; conditionIndex: number; attribute: keyof Condition; value: any }
  | { type: 'VALIDATE_RULE'; activityId: ActivityId }
  | { type: 'INVALIDATE_RULE'; activityId: ActivityId }
  | { type: 'DELETE_CONDITION'; activityId: ActivityId; statementIndex: number; conditionIndex: number };

enableMapSet();

export const reducer = (state: UIState, action: Action): UIState => {
  switch (action.type) {
    case 'TOGGLE_EDIT_MODE':
      return { editMode: !state.editMode, editedRules: new Set(), invalidRules: new Set() };

    case 'RESET_EDIT_MODE':
      return { editMode: state.editMode, editedRules: new Set(), invalidRules: new Set() };

    case 'ADD_STATEMENT':
      return {
        ...state,
        editedRules: new Set([...state.editedRules, action.activityId]),
        [action.activityId]: produce(state[action.activityId]!, draft => {
          draft.splice(draft.length - 1, 0, { conditions: [{}], result: {} });
        })
      };

    case 'ADD_CONDITION': {
      return {
        ...state,
        editedRules: new Set([...state.editedRules, action.activityId]),
        [action.activityId]: produce(state[action.activityId]!, draft => {
          draft[action.statementIndex].conditions.splice(action.conditionIndex, 0, {});
        })
      };
    }

    case 'UPDATE_CONDITION': {
      return {
        ...state,
        editedRules: new Set([...state.editedRules, action.activityId]),
        [action.activityId]: produce(state[action.activityId]!, draft => {
          if (action.attribute === 'reference') {
            draft[action.statementIndex].conditions[action.conditionIndex] = { reference: action.value };
          } else {
            draft[action.statementIndex].conditions[action.conditionIndex][action.attribute] = action.value;
          }
        })
      };
    }

    case 'DELETE_CONDITION': {
      return {
        ...state,
        editedRules: new Set([...state.editedRules, action.activityId]),
        [action.activityId]: produce(state[action.activityId]!, draft => {
          if (action.conditionIndex === 0) {
            draft.splice(action.statementIndex, 1);
          } else {
            draft[action.statementIndex].conditions.splice(action.conditionIndex, 1);
          }
        })
      };
    }

    case 'INIT_RULE':
      return { ...state, [action.activityId]: action.rule };

    case 'UPDATE_SEQUENCING':
      return {
        ...state,
        editedRules: new Set([...state.editedRules, 'setup-sequencing']),
        'setup-sequencing': produce(state['setup-sequencing']!, draft => {
          draft[action.statementIndex].result[action.attribute] = action.value;
        })
      };

    case 'UPDATE_VALIDATE_MTM_PRODUCT':
      return {
        ...state,
        editedRules: new Set([...state.editedRules, 'validate-mtm-product']),
        'validate-mtm-product': produce(state['validate-mtm-product']!, draft => {
          draft[action.statementIndex].result[action.attribute] = action.value;
        })
      };

    case 'VALIDATE_RULE': {
      const invalidRules = new Set(state.invalidRules);
      invalidRules.delete(action.activityId);
      return { ...state, invalidRules };
    }

    case 'INVALIDATE_RULE': {
      const invalidRules = new Set([...state.invalidRules, action.activityId]);
      return { ...state, invalidRules };
    }
  }
};

export const UIStateContext = createContext<[UIState, Dispatch<Action>]>([InitialState, (_: Action) => {}]);
UIStateContext.displayName = 'UIStateContext';

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
