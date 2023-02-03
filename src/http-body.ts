import http from 'http';
import { HttpException } from '@caviajs/http-exception';
import { Readable } from 'stream';
import iconv from 'iconv-lite';

export class HttpBody {
  public static async parse(request: http.IncomingMessage, outputType: 'stream'): Promise<Readable | undefined>;
  public static async parse(request: http.IncomingMessage, outputType: 'buffer'): Promise<Buffer | undefined>;
  public static async parse(request: http.IncomingMessage, outputType: 'json'): Promise<any | undefined>;
  public static async parse(request: http.IncomingMessage, outputType: 'string'): Promise<string | undefined>;
  public static async parse(request: http.IncomingMessage, outputType: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (request.headers['transfer-encoding'] === undefined && isNaN(parseInt(request.headers['content-length'], 10))) {
        return resolve(undefined);
      }

      // The Content-Length header is mandatory for messages with entity bodies,
      // unless the message is transported using chunked encoding (transfer-encoding).
      if (request.headers['transfer-encoding'] === undefined && request.headers['content-length'] === undefined) {
        return reject(new HttpException(411, `Length Required`));
      }

      if (outputType === 'stream') {
        return resolve(request);
      }

      // data
      let data: Buffer = Buffer.alloc(0);

      request.on('data', (chunk: Buffer) => {
        data = Buffer.concat([data, chunk]);
      });

      request.on('end', () => {
        // content-length header check with buffer length
        const contentLength: number = parseInt(request.headers['content-length'], 10);

        if (contentLength && contentLength !== data.length) {
          return reject(new HttpException(400, 'Request size did not match Content-Length'));
        }

        const contentTypeCharset: string | undefined = getContentTypeParameter(request.headers['content-type'], 'charset');

        if (contentTypeCharset && !iconv.encodingExists(contentTypeCharset)) {
          return Promise.reject(new HttpException(415, `Unsupported charset: ${ contentTypeCharset }`));
        }

        switch (outputType) {
          case 'buffer':
            return resolve(data);
          case 'json':
            try {
              return resolve(JSON.parse(contentTypeCharset ? iconv.decode(data, contentTypeCharset) : data.toString()));
            } catch (err) {
              return reject(new HttpException(422)); // Unprocessable Entity
            }
          case 'string':
            return resolve(contentTypeCharset ? iconv.decode(data, contentTypeCharset) : data.toString());
        }
      });

      request.on('error', error => {
        return reject(error);
      });
    });
  }
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
function getContentTypeParameter(header: string, parameter: string): string | undefined {
  return header?.split(';').find(it => it.includes(parameter))?.split('=')[1]?.trim();
}
