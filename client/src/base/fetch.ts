export const fetchData = async (token: string, url: string) => {
  const request = buildRequest(token, 'GET');
  const response = await fetch(`/api/${url}`, request);
  if (response.status !== 200) throw new Error('Data could not be retrieved');
  return await response.json();
};

export const sendData = async (token: string, url: string, method: 'PATCH' | 'PUT' | 'POST' | 'DELETE', data: any = undefined) => {
  const request = buildRequest(token, method, data);
  const response = await fetch(`/api/${url}`, request);
  if (response.status >= 400) {
    const error = await response.json();
    if (error.code && error.data) {
      throw new BusinessError(error.code, error.data);
    } else {
      throw error;
    }
  } else if (response.headers.get('location') !== '') {
    return response.headers.get('location');
  }
};

const buildRequest = (token: string, method: string, body: any = undefined) => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json'
  };
  return { headers, method: method, body: JSON.stringify(body) };
};

export class BusinessError {
  constructor(readonly code: string, readonly data: Record<string, any>) {}
}
