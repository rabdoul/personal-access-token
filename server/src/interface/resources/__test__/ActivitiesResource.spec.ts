import 'jest';
import { Principal } from 'lectra-auth-nodejs';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { ActivitiesResource } from '../ActivitiesResource';

import { mocked } from 'ts-jest/utils';
import { currentPrincipal } from '../../../application/Authentication';

jest.mock('../../../application/Authentication');

describe('ActivitiesResource', () => {

    beforeEach(() => {
        mocked(currentPrincipal).mockImplementation(() => new Principal('sub|42', '123456789_A', 'en_EN', [{ offer: 'OD', market: 'FA' }]))
    });

    it('GET should return 200 if query success', async () => {
        const req = mockHttpRequest('/api/paramaters');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess(
            'cutadmin',
            { type: 'production-rules-configuration.query.get', parameters: {} },
            { activities: [{ reference: "Setup sequencing", order: 0, enabled: false, x: 2 }] }
        ).build();

        await new ActivitiesResource(executor).get(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ reference: "Setup sequencing", order: 0, enabled: false }]);
    });

    it('toActivities should return all activities when user is authorized for OD', async () => {
        const activities = ActivitiesResource.toActivities({
            activities: [
                { reference: "Setup sequencing", order: 0, enabled: false, eligibleProcess: [1] },
                { reference: "Analyse product order", order: 1, enabled: false, eligibleProcess: [2] },
                { reference: "Validate MTM Product", order: 2, enabled: false, eligibleProcess: [3] },
                { reference: "Generate batch", order: 3, enabled: false, eligibleProcess: [4] }
            ]
        });

        expect(activities).toEqual([
            { reference: "Setup sequencing", order: 0, enabled: false },
            { reference: "Analyse product order", order: 1, enabled: false },
            { reference: "Validate MTM Product", order: 2, enabled: false },
            { reference: "Generate batch", order: 3, enabled: false }
        ]);
    });

    it('toActivities should not return any activity when user is authorized for non handled offer', async () => {
        mocked(currentPrincipal).mockImplementation(() => new Principal('1123456789_A', 'framboise@lectra.com', 'en_EN', [{ offer: 'C1', market: 'FA' }]))
        const activities = ActivitiesResource.toActivities({
            activities: [
                { reference: "Setup sequencing", order: 0, enabled: false, eligibleProcess: [1] },
                { reference: "Analyse product order", order: 1, enabled: false, eligibleProcess: [2] },
                { reference: "Validate MTM Product", order: 2, enabled: false, eligibleProcess: [3] },
                { reference: "Generate batch", order: 3, enabled: false, eligibleProcess: [4] }
            ]
        });

        expect(activities).toEqual([]);
    });

    it('toActivities should return activities of corresponding offers', async () => {
        mocked(currentPrincipal).mockImplementation(() => new Principal('1123456789_A', 'framboise@lectra.com', 'en_EN', [{ offer: 'MTO', market: 'FA' }, { offer: 'MTC', market: 'FA' }]))
        const activities = ActivitiesResource.toActivities({
            activities: [
                { reference: "Setup sequencing", order: 0, enabled: false, eligibleProcess: [1] },
                { reference: "Analyse product order", order: 1, enabled: false, eligibleProcess: [2] },
                { reference: "Validate MTM Product", order: 2, enabled: false, eligibleProcess: [3] },
                { reference: "Generate batch", order: 3, enabled: false, eligibleProcess: [1, 3] }
            ]
        });

        expect(activities).toEqual([
            { reference: "Setup sequencing", order: 0, enabled: false },
            { reference: "Analyse product order", order: 1, enabled: false },
            { reference: "Generate batch", order: 3, enabled: false }
        ]);
    });

});