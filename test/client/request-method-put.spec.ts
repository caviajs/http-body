import http from 'http';
import { HttpClient } from '../../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should execute the request with the given method - PUT', async () => {
  let method: string;

  const httpServer: http.Server = http.createServer((request, response) => {
    method = request.method;

    response.end();
  });

  await HttpClient
    .request({
      method: 'PUT',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(method).toBe('PUT');
});
