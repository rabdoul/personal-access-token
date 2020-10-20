import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import produce, { enableMapSet } from 'immer';

import { Condition, ActivityRule, StatementResult } from './model';
import { Sequencing } from './rules/SequencingRule';
import { ValidateMTMProduct } from './rules/ValidateMTMProductRule';
import { AssociateCuttingRequirements } from './rules/AssociateCuttingRequirementsRule';
import { Publish } from './rules/PublishRule';
import { AssociateCuttingActivities } from './rules/AssociateCuttingActivitiesRule';
import { ValidateMarker } from './rules/ValidateMarkerRule';
import { RollAssignment } from './rules/RollAssignmentRule';
import { GenerateSectionPlan } from './rules/GenerateSectionPlanRule';
import { GenerateSpreadingPlan } from './rules/GenerateSpreadingPlanRule';
import { GenerateBatch } from './rules/GenerateBatchRule';

export type ActivityId = keyof Omit<UIState, 'editedRules' | 'editMode' | 'invalidRules'>;

// tag::uiState[]
export type UIState = {
  editMode: boolean;
  editedRules: Set<ActivityId>;
  invalidRules: Set<ActivityId>;
  'setup-sequencing'?: ActivityRule<Sequencing>;
  'validate-mtm-product'?: ActivityRule<ValidateMTMProduct>;
  'generate-batch'?: ActivityRule<GenerateBatch>;
  'associate-cutting-requirements'?: ActivityRule<AssociateCuttingRequirements>;
  publish?: ActivityRule<Publish>;
  'associate-cutting-activities'?: ActivityRule<AssociateCuttingActivities>;
  'validate-marker'?: ActivityRule<ValidateMarker>;
  'after-nesting-roll-allocation'?: ActivityRule<RollAssignment>;
  'generate-section-plan'?: ActivityRule<GenerateSectionPlan>;
  'generate-spreading-plan'?: ActivityRule<GenerateSpreadingPlan>;
};
// end::uiState[]

const InitialState: UIState = {
  editMode: false,
  editedRules: new Set(),
  invalidRules: new Set()
};

type UpdateStatementResult<ID extends ActivityId, SR extends StatementResult> = {
  type: 'UPDATE_STATEMENT_RESULT';
  activityId: ID;
  statementIndex: number;
  attribute: keyof SR;
  value: any;
};

// tag::action[]
export type Action =
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'RESET_EDIT_MODE' }
  | { type: 'ADD_STATEMENT'; activityId: ActivityId }
  | { type: 'ADD_CONDITION'; activityId: ActivityId; statementIndex: number; conditionIndex: number }
  | { type: 'UPDATE_CONDITION'; activityId: ActivityId; statementIndex: number; conditionIndex: number; attribute: keyof Condition; value: any }
  | { type: 'DELETE_CONDITION'; activityId: ActivityId; statementIndex: number; conditionIndex: number }
  | { type: 'INIT_RULE'; activityId: ActivityId; rule: ActivityRule<StatementResult> }
  | { type: 'VALIDATE_RULE'; activityId: ActivityId }
  | { type: 'INVALIDATE_RULE'; activityId: ActivityId }
  | { type: 'ADD_CRITERIA_GENERATE_BATCH'; statementIndex: number }
  | { type: 'REMOVE_ALL_CRITERIONS_GENERATE_BATCH'; statementIndex: number }
  | UpdateStatementResult<'setup-sequencing', Sequencing>
  | UpdateStatementResult<'validate-mtm-product', ValidateMTMProduct>
  | UpdateStatementResult<'generate-batch', GenerateBatch>
  | UpdateStatementResult<'publish', Publish>
  | UpdateStatementResult<'generate-section-plan', GenerateSectionPlan>
  | UpdateStatementResult<'generate-spreading-plan', GenerateSpreadingPlan>
  | UpdateStatementResult<'validate-marker', ValidateMarker>
  | UpdateStatementResult<'associate-cutting-requirements', AssociateCuttingRequirements>
  | UpdateStatementResult<'associate-cutting-activities', AssociateCuttingActivities>
  | UpdateStatementResult<'after-nesting-roll-allocation', RollAssignment>;
// end::action[]

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

    case 'VALIDATE_RULE': {
      const invalidRules = new Set(state.invalidRules);
      invalidRules.delete(action.activityId);
      return { ...state, invalidRules };
    }

    case 'INVALIDATE_RULE': {
      const invalidRules = new Set([...state.invalidRules, action.activityId]);
      return { ...state, invalidRules };
    }

    case 'UPDATE_STATEMENT_RESULT':
      return {
        ...state,
        editedRules: new Set([...state.editedRules, action.activityId]),
        [action.activityId]: produce(state[action.activityId]!, draft => {
          (draft[action.statementIndex].result as any)[action.attribute] = action.value;
        })
      };

    case 'ADD_CRITERIA_GENERATE_BATCH':
      return {
        ...state,
        'generate-batch': produce(state['generate-batch']!, draft => {
          if (draft[action.statementIndex].result.criterions) {
            draft[action.statementIndex].result.criterions!.push({});
          } else {
            draft[action.statementIndex].result.criterions = [{}];
          }
        })
      };

    case 'REMOVE_ALL_CRITERIONS_GENERATE_BATCH':
      return {
        ...state,
        'generate-batch': produce(state['generate-batch']!, draft => {
          (draft[action.statementIndex].result as any).criterions = null;
        })
      };
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
