import { Test, type TestingModule } from '@nestjs/testing';
import { type INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('appController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return "Hello World"(GET)', async () => {
    return await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/POST registration successfull', async () => {
    const userMock = {
      firstName: 'string',
      lastName: 'string',
      email: 'string@gmail.com',
      password: 'Q*123qw231eqw23e132qwe',
    };

    return await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userMock)
      .expect(201)
      .expect(userMock);
  });

  it('/POST registration failed', async () => {
    const userMock = {
      lastName: '',
      email: 'string',
      password: '1232qwe',
    };

    return await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userMock)
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
