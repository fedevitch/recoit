import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { APP_GUARD } from './constants';
import { INestApplication } from '@nestjs/common';
import { AppGuard } from './app.guard';

function createTestModule(guard) {
    return Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: APP_GUARD,
          useValue: guard,
        },
      ],
    }).compile();
}

const TIMEOUT = 1000;

describe('Guards', () => {
    let app: INestApplication;

    it('2+2', () => { expect(2+2).toBe(4) });

    // beforeAll(async () => {
    //     const moduleRef = await createTestModule(null);
    //     const guard = moduleRef.get(AppGuard);
    //     app = (await createTestModule(guard)).createNestApplication();
  
    //     await app.init();
    // }, TIMEOUT);
  
    // it(`should prevent access (unauthorized)`, async () => {      
    //   return request(app.getHttpServer()).post('/log').expect(401);
    // }, TIMEOUT);

    // afterAll(async () => {
    //     await app.close();
    // }, TIMEOUT);
  });