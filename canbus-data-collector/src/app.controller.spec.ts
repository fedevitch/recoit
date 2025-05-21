import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CanLog } from './db/canlog.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockCanLogModel = jest.fn(() => ({
      save: jest.fn(),
    }));

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, 
        {
          provide: getModelToken(CanLog.name),
          useValue: mockCanLogModel,
        }
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('Health endpoint should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('Log endpoint should run normally', () => {
      expect(appController.canLog({ timestamp: '2025-04-28', canId: 'spec.test', data: {} })).toBeDefined();
    });
  });
});
