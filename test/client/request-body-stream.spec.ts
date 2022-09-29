import http from 'http';
import { Readable } from 'stream';
import { HttpClient } from '../../src';
import { getHttpServerUrl } from '../_utils/get-http-server-url';

it('should execute the request with the given body - stream', async () => {
  let contentType: string;
  let buffer: Buffer = Buffer.alloc(0);

  const httpServer: http.Server = http.createServer((request, response) => {
    contentType = request.headers['content-type'];

    request.on('data', (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk]);
    });

    request.on('end', () => {
      response.end();
    });
  });

  await HttpClient
    .request({
      body: Readable.from('Hello Cavia'),
      method: 'POST',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(contentType).toBe('application/octet-stream');
  expect(buffer.toString()).toBe('Hello Cavia');
});
