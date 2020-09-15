import 'jest';
import { mockHttpRequest, mockHttpResponse } from '../../../__test__/Mocks';
import { K8sResources } from '../K8sResources';

describe('K8sResource', () => {

    it('/ping should return pong', () => {
        const req = mockHttpRequest(`/ping`);
        const [res] = mockHttpResponse();
  
        new K8sResources().ping(req, res);
  
        expect(res.statusCode).toEqual(200);
        expect(res._getHeaders()["content-type"]).toEqual("text/plain");
        expect(res._getData()).toEqual("pong");
    })

    it('/ready should return ready', () => {
        const req = mockHttpRequest(`/ready`);
        const [res] = mockHttpResponse();
  
        new K8sResources().ready(req, res);
  
        expect(res.statusCode).toEqual(200);
        expect(res._getHeaders()["content-type"]).toEqual("text/plain");
        expect(res._getData()).toEqual("ready");
    })

})