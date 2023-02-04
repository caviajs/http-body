import http from 'http';
import supertest from 'supertest';
import { HttpBody } from '../src';

it('parse - stream', (done) => {
  const DATA: string = 'Hello World';

  const httpServer: http.Server = http.createServer((request, response) => {
    HttpBody
      .parse(request, 'stream')
      .then(body => {
        let data: Buffer = Buffer.alloc(0);

        body.on('data', (chunk: Buffer) => {
          data = Buffer.concat([data, chunk]);
        });

        body.on('end', () => {
          try {
            expect(data.toString()).toEqual(DATA);
          } catch (error) {
            done(error);
          }
        });

        body.on('error', error => {
          done(error);
        });

        response.end();
      })
      .catch(error => {
        done(error);

        response.end();
      });
  });

  supertest(httpServer)
    .post('/')
    .send(DATA)
    .then(() => {
      done();
    });
});
