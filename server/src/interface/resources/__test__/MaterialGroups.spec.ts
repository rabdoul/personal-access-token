import 'jest';
import { mockHttpRequest, mockHttpResponse, CommandQueryExecutorMockBuilder } from '../../../__test__/Mocks';
import { MaterialGroupsResource } from '../MaterialSpecsResource';
import { ProductCategoriesResource } from '../ProductCategoriesResource';

describe('MatrialGroupsResource', () => {

    it('GET should return nesting groups', async () => {
        const req = mockHttpRequest('/api/material-nesting-groups');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess('material',
            { type: 'nesting-group.query.list', parameters: {} },
            [{ reference: "Cotton" }]
        ).build();

        await new MaterialGroupsResource(executor).nesting(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ value: "Cotton", label: "Cotton" }]);
    });

    it('GET should return cutting groups', async () => {
        const req = mockHttpRequest('/api/material-nesting-groups');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess('material',
            { type: 'cutting-group.query.list', parameters: {} },
            [{ reference: "Cotton" }]
        ).build();

        await new MaterialGroupsResource(executor).cutting(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ value: "Cotton", label: "Cotton" }]);
    });

    it('GET should return spreading groups', async () => {
        const req = mockHttpRequest('/api/material-nesting-groups');
        const [res] = mockHttpResponse();

        const executor = CommandQueryExecutorMockBuilder.newMock().withQuerySuccess('material',
            { type: 'spreading-group.query.list', parameters: {} },
            [{ reference: "Cotton" }]
        ).build();

        await new MaterialGroupsResource(executor).spreading(req, res);

        expect(res.statusCode).toEqual(200);
        expect(res._getData()).toEqual([{ value: "Cotton", label: "Cotton" }]);
    });


});