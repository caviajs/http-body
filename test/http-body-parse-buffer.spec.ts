import http from 'http';
import supertest from 'supertest';
import { HttpBody } from '../src';

it('parse - buffer', async () => {
  const DATA: string = 'Hello World';

  let body: Buffer;

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpBody
      .parse(request, 'buffer')
      .then(result => {
        body = result;

        response.end();
      })
      .catch(() => {
        response.end();
      });
  });

  await supertest(httpServer)
    .post('/')
    .send(DATA);

  expect(body.toString()).toEqual(DATA);
});
