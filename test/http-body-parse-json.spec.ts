import http from 'http';
import supertest from 'supertest';
import { HttpBody } from '../src';
import { HttpException } from '@caviajs/http-exception';

it('parse - json', async () => {
  const DATA = { foo: 1245, bar: 123 };

  let body: any;

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpBody
      .parse(request, 'json')
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
    .send(JSON.stringify(DATA));

  expect(body).toEqual(DATA);
});

it('parse - invalid json', async () => {
  let httpException: HttpException;

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpBody
      .parse(request, 'json')
      .then(() => {
        response.end();
      })
      .catch(error => {
        httpException = error;

        response.end();
      });
  });

  await supertest(httpServer)
    .post('/')
    .send(''); // invalid json

  expect(httpException.reason).toEqual('Unprocessable Entity');
  expect(httpException.status).toEqual(422);
});
