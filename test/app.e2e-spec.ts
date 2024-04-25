import { Test, type TestingModule } from '@nestjs/testing';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('appController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.DB_URI = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/POST registration successfull', async () => {
    const userMock = {
      firstName: 'string',
      lastName: 'string',
      email: 'string@gmail.com',
      password: 'Q*123qw231eqw23e132qwe',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userMock)
      .expect(201);

    expect(response.body).toHaveProperty('firstName', userMock.firstName);
    expect(response.body).toHaveProperty('lastName', userMock.lastName);
    expect(response.body).toHaveProperty('email', userMock.email);
    expect(response.body).toHaveProperty('password', userMock.password);
  });

  it('/POST registration failed', async () => {
    const userMock = {
      lastName: '',
      email: 'string',
      password: '1232qwe',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userMock)
      .expect(400);

    expect(response.body).toHaveProperty('message', [
      'firstName must be a string',
      'firstName should not be empty',
      'lastName should not be empty',
      'email must be an email',
      'password is not strong enough',
    ]);
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });
});
