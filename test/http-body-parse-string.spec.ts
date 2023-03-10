import http from 'http';
import supertest from 'supertest';
import { HttpBody } from '../src';

it('parse - string', async () => {
  const DATA: string = 'Hello World';

  let body: any;

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpBody
      .parse(request, 'string')
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

  expect(body).toEqual(DATA);
});
