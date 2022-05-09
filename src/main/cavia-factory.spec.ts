import path from 'path';
import { Env } from './providers/env';
import { Logger } from './providers/logger';
import { LOGGER_LEVEL, LoggerLevel } from './providers/logger-level';
import { LOGGER_MESSAGE_FACTORY } from './providers/logger-message-factory';
import { Storage } from './providers/storage';
import { Validator } from './providers/validator';
import { View } from './providers/view';
import { VIEW_DIRECTORY_PATH } from './providers/view-directory-path';
import { CaviaApplication } from './cavia-application';
import { CaviaFactory } from './cavia-factory';
import { CORE_CONTEXT } from './constants';
import { Container } from './container';
import { Body } from './providers/body';
import { BodyExplorer } from './providers/body-explorer';
import { HttpClient } from './providers/http-client';
import { HttpServerRouter } from './providers/http-server-router';
import { HttpServerExplorer } from './providers/http-server-explorer';
import { HTTP_SERVER } from './providers/http-server';
import http from 'http';
import { HttpServerHandler } from './providers/http-server-handler';
import { HttpServerManager } from './providers/http-server-manager';
import { HTTP_SERVER_PORT } from './providers/http-server-port';

describe('CaviaFactory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should contain built-in providers', async () => {
      const application = await CaviaFactory.create({});

      expect(await application.container.find(Body)).toBeInstanceOf(Body);
      expect(await application.container.find(BodyExplorer)).toBeInstanceOf(BodyExplorer);
      expect(await application.container.find(Env)).toBeInstanceOf(Env);
      expect(await application.container.find(Container)).toBeInstanceOf(Container);
      expect(await application.container.find(HttpClient)).toBeInstanceOf(HttpClient);
      expect(await application.container.find(HTTP_SERVER)).toBeInstanceOf(http.Server);
      expect(await application.container.find(HttpServerExplorer)).toBeInstanceOf(HttpServerExplorer);
      expect(await application.container.find(HttpServerHandler)).toBeInstanceOf(HttpServerHandler);
      expect(await application.container.find(HttpServerManager)).toBeInstanceOf(HttpServerManager);
      expect(await application.container.find(HTTP_SERVER_PORT)).toEqual(3000);
      expect(await application.container.find(HttpServerRouter)).toBeInstanceOf(HttpServerRouter);
      expect(await application.container.find(Logger)).toBeInstanceOf(Logger);
      expect(await application.container.find(LOGGER_LEVEL)).toEqual(LoggerLevel.ALL);
      expect(await application.container.find(LOGGER_MESSAGE_FACTORY)).toEqual(expect.any(Function));
      expect(await application.container.find(Storage)).toBeInstanceOf(Storage);
      expect(await application.container.find(Validator)).toBeInstanceOf(Validator);
      expect(await application.container.find(View)).toBeInstanceOf(View);
      expect(await application.container.find(VIEW_DIRECTORY_PATH)).toEqual(path.join(process.cwd(), 'resources', 'views'));
    });

    it('should collect application providers', async () => {
      const application = await CaviaFactory.create({
        providers: [
          { provide: 'foo-1', useValue: 10 },
          { provide: 'foo-2', useValue: 20 },
          { provide: 'bar-1', useValue: 30 },
          { provide: 'bar-2', useValue: 40 },
        ],
      });

      expect(await application.container.find('foo-1')).toEqual(10);
      expect(await application.container.find('foo-2')).toEqual(20);
      expect(await application.container.find('bar-1')).toEqual(30);
      expect(await application.container.find('bar-2')).toEqual(40);
    });

    it('should determine the appropriate weighting of providers', async () => {
      const application = await CaviaFactory.create({
        providers: [
          { provide: 'foo', useValue: 1 },
          { provide: 'foo', useValue: 2 },
          { provide: 'foo', useValue: 3 },
        ],
      });

      expect(await application.container.find('foo')).toEqual(3);
    });

    it('should use Logger', async () => {
      const loggerTraceSpy = jest.spyOn(Logger.prototype, 'trace');

      expect(loggerTraceSpy).toHaveBeenCalledTimes(0);

      await CaviaFactory.create({});

      expect(loggerTraceSpy).toHaveBeenNthCalledWith(1, 'Starting application...', CORE_CONTEXT);
    });

    it('should call a boot method on the CaviaApplication instance', async () => {
      const caviaApplicationBootSpy = jest.spyOn(CaviaApplication.prototype, 'boot');

      expect(caviaApplicationBootSpy).toHaveBeenCalledTimes(0);

      await CaviaFactory.create({});

      expect(caviaApplicationBootSpy).toHaveBeenNthCalledWith(1);
    });

    it('should return CaviaApplication instance', async () => {
      const application = await CaviaFactory.create({});

      expect(application).toBeInstanceOf(CaviaApplication);
    });
  });
});
