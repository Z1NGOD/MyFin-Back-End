import { Test, type TestingModule } from '@nestjs/testing';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { RedisMemoryServer } from 'redis-memory-server';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '@libs/security';
import { RedisModule } from '@libs/redis/redis.module';
import { AuthService } from '@core/auth/services';
import { UserService } from '@core/user/services';
import { UserRepository } from '@libs/db/repositories';
import { AppModule } from '../src/app.module';

describe('appController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let redisServer: RedisMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    redisServer = new RedisMemoryServer();
    process.env.DB_URI = mongoServer.getUri();
    process.env.REDIS_HOST = await redisServer.getHost();
    process.env.REDIS_PORT = (await redisServer.getPort()).toString();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, RedisModule],
      providers: [
        AuthService,
        TokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        ConfigService,
      ],
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

    await request(app.getHttpServer())
      .post('/auth/registration')
      .send(userMock)
      .expect(201);
  });

  it('/POST login successfull', async () => {
    const userMock = {
      email: 'string@gmail.com',
      password: 'Q*123qw231eqw23e132qwe',
    };

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(userMock)
      .expect(201);
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

  it('/POST login failed', async () => {
    const userMock = {
      email: 'string',
      password: '1232qwe',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userMock)
      .expect(400);

    expect(response.body).toHaveProperty('message', [
      'email must be an email',
      'password is not strong enough',
    ]);
  });

  it('/POST logout successfull', async () => {
    const userMock = {
      email: 'string',
      password: '1232qwe',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userMock)
      .expect(201);

    const response2 = await request(app.getHttpServer())
      .post('/auth/logout')
      .send(response.body)
      .expect(201);

    expect(response2.body).toHaveProperty('accessToken');
  });
  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
    await redisServer.stop();
  });
});
