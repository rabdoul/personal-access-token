import { valueUnitFromUnitType } from "../../../application/model";
import { mockHttpRequest, mockHttpResponse } from "../../../__test__/Mocks";
import { ValueUnitsResource } from "../ValueUnitsResource";

describe('ValueUnitsResource', () => {

    it('GET should return all value unit', () => {
        const req = mockHttpRequest(`/api/value-units`);
        const [res] = mockHttpResponse();
  
        new ValueUnitsResource().get(req, res);
  
        expect(res.statusCode).toEqual(200);
        expect(res._getData()['MarkerLength']).toEqual(valueUnitFromUnitType('MarkerLength'));
    })
})