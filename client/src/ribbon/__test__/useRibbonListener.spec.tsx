import { Sequencing, ValidateMTMProduct } from '../../model';
import { RuleId, UIState } from '../../UIState';
import { getRulesPatch } from '../useRibbonListener';

describe('getRulesPatch', () => {
  it('return patch with only sequencing rule ', () => {
    const state = { editMode: true, editedRules: ['setup-sequencing'], 'setup-sequencing': { splitCommandProducts: true, numberOfProductOrders: 3 } } as UIState;
    const expectedPatch = [
      {
        op: 'replace',
        path: 'setup-sequencing',
        value: { splitCommandProducts: true, numberOfProductOrders: 3 }
      }
    ];

    expect(getRulesPatch(state)).toEqual(expectedPatch);
  });

  it('return patch with two rules', () => {
    const state = {
      editMode: true,
      editedRules: ['setup-sequencing', 'validate-mtm-product'],
      'setup-sequencing': { splitCommandProducts: true, numberOfProductOrders: 3 },
      'validate-mtm-product': { stopOnOutOfRangeWarning: true, stopOnIncorrectValueWarning: false }
    } as UIState;
    const expectedPatch = [
      {
        op: 'replace',
        path: 'setup-sequencing',
        value: { splitCommandProducts: true, numberOfProductOrders: 3 }
      },
      {
        op: 'replace',
        path: 'validate-mtm-product',
        value: { stopOnOutOfRangeWarning: true, stopOnIncorrectValueWarning: false }
      }
    ];

    expect(getRulesPatch(state)).toEqual(expectedPatch);
  });
});
