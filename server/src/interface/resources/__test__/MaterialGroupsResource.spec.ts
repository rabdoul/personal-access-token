import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { MaterialGroupsResource } from '../MaterialGroupsResource';

describe('MatrialGroupsResource', () => {

    it('GET should return nesting groups', async () => {
        const req = mockHttpRequest('/api/material-nesting-groups');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess('material',
            { type: 'nesting-group.query.list', parameters: {} },
            [{ reference: "Cotton", nestingGroupId: '123456' }]
        ).build();

        await new MaterialGroupsResource(executor).nesting(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ value: "123456", label: "Cotton" }]);
    });

    it('GET should return cutting groups', async () => {
        const req = mockHttpRequest('/api/material-cutting-groups');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess('material',
            { type: 'cutting-group.query.list', parameters: {} },
            [{ reference: "Cotton", cuttingGroupId: '123456' }]
        ).build();

        await new MaterialGroupsResource(executor).cutting(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ value: "123456", label: "Cotton" }]);
    });

    it('GET should return spreading groups', async () => {
        const req = mockHttpRequest('/api/material-spreading-groups');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess('material',
            { type: 'spreading-group.query.list', parameters: {} },
            [{ reference: "Cotton", spreadingGroupId: '123456' }]
        ).build();

        await new MaterialGroupsResource(executor).spreading(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ value: "123456", label: "Cotton" }]);
    });


});