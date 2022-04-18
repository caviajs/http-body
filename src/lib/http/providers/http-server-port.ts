import { ValueProvider } from '../../ioc/types/provider';
import { Token } from '../../ioc/types/token';

export const HTTP_SERVER_PORT: Token<HttpServerPort> = Symbol('HTTP_SERVER_PORT');

export const HttpServerPortProvider: ValueProvider<HttpServerPort> = {
  provide: HTTP_SERVER_PORT,
  useValue: 3000,
};

export type HttpServerPort = number;