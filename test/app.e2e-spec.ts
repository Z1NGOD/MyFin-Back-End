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
import { type Ilogin } from './interfaces/ilogin.interface';
import { type Ibudget } from './interfaces/ibudget.interface';
import { type Iexpense } from './interfaces/iexpence.interface';

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

  describe('auth', () => {
    describe('/POST registration', () => {
      it('successfull', async () => {
        const userMock = {
          firstName: 'string',
          lastName: 'string',
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };

        const res = await request(app.getHttpServer())
          .post('/auth/registration')
          .send(userMock)
          .expect(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
      });

      it('unsuccessfull', async () => {
        const userMock = {
          firstName: 1,
          email: 'string@gmail.com',
        };

        const res = await request(app.getHttpServer())
          .post('/auth/registration')
          .send(userMock)
          .expect(400);
        expect(res.body).toHaveProperty('message');
      });
    });

    describe('/POST login', () => {
      it('successfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };

        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
      });

      it('unsuccessfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
        };

        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(400);
        expect(res.body).toHaveProperty('message');
      });
    });

    describe('/POST updateAccessToken', () => {
      it('successfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);

        const loginResponce: Ilogin = login.body as Ilogin;
        const refreshTokenMock = { refreshToken: loginResponce.refreshToken };
        const res = await request(app.getHttpServer())
          .post('/auth/updateAccessToken')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(refreshTokenMock)
          .expect(201);
        expect(res.body).toHaveProperty('accessToken');
      });

      it('unsuccessfull', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/updateAccessToken')
          .send({})
          .expect(403);
        expect(res.body).toHaveProperty('message');
      });
    });

    describe('/POST logout', () => {
      it('successfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);
        const loginResponce: Ilogin = login.body as Ilogin;

        const res = await request(app.getHttpServer())
          .post('/auth/logout')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send({
            accessToken: loginResponce.accessToken,
            refreshToken: loginResponce.refreshToken,
          })
          .expect(201);
        expect(res.body).toHaveProperty('message');
      });

      it('unsuccessfull', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/logout')
          .expect(401);
        expect(res.body).toHaveProperty('message');
      });
    });
  });

  describe('budgets', () => {
    describe('/POST create', () => {
      it('successfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);
        const loginResponce: Ilogin = login.body as Ilogin;

        const budgetMock = {
          userId: loginResponce.user._id,
          currencyId: '6650cddc7cb8435306eb1a2e',
          amount: 100,
          type: 'WEEK',
        };

        const res = await request(app.getHttpServer())
          .post('/budgets/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(budgetMock)
          .expect(201);

        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('userId');
        expect(res.body).toHaveProperty('currencyId');
        expect(res.body).toHaveProperty('amount');
        expect(res.body).toHaveProperty('type');
      });
    });

    describe('/GET find', () => {
      it('successfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);
        const loginResponce: Ilogin = login.body as Ilogin;

        const budgetMock = {
          userId: loginResponce.user._id,
          currencyId: '6650cddc7cb8435306eb1a2e',
          amount: 100,
          type: 'WEEK',
        };

        const res = await request(app.getHttpServer())
          .post('/budgets/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(budgetMock)
          .expect(201);

        const resFind: Ibudget = res.body as Ibudget;
        const res2 = await request(app.getHttpServer())
          .get(`/budgets/${resFind._id}`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .expect(200);
        expect(res2).toHaveProperty('header');
      });
    });

    describe('/PATCH update', () => {
      it('successfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);

        const loginResponce: Ilogin = login.body as Ilogin;
        const updateBudgetMock = {
          amount: 200,
        };
        const budgetMock = {
          userId: loginResponce.user._id,
          currencyId: '6650cddc7cb8435306eb1a2e',
          amount: 100,
          type: 'WEEK',
        };

        const res = await request(app.getHttpServer())
          .post('/budgets/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(budgetMock)
          .expect(201);
        const resType: Ibudget = res.body as Ibudget;

        const res2 = await request(app.getHttpServer())
          .patch(`/budgets/update/${resType._id}`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(updateBudgetMock)
          .expect(200);
        expect(res2).toHaveProperty('header');
      });
    });
  });
  describe('expenses', () => {
    describe('/GET findAll', () => {
      it('successfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);
        const loginResponce: Ilogin = login.body as Ilogin;

        const expenseMock = {
          userId: loginResponce.user._id,
          currencyId: '6650cddc7cb8435306eb1a2f',
          categoryId: '6650d29a21f0205cce148ab1',
          amount: 100,
          details: 'test',
        };

        await request(app.getHttpServer())
          .post('/expenses/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(expenseMock)
          .expect(201);

        const res = await request(app.getHttpServer())
          .get(`/expenses`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .expect(200);
        expect(res).toHaveProperty('header');
      });
    });

    describe('/GET find', () => {
      it('successfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);
        const loginResponce: Ilogin = login.body as Ilogin;

        const expenseMock = {
          userId: loginResponce.user._id,
          currencyId: '6650cddc7cb8435306eb1a2f',
          categoryId: '6650d29a21f0205cce148ab1',
          amount: 100,
          details: 'test',
        };

        const res = await request(app.getHttpServer())
          .post('/expenses/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(expenseMock)
          .expect(201);

        const resType: Iexpense = res.body as Iexpense;

        const res2 = await request(app.getHttpServer())
          .get(`/expenses/${resType._id}`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .expect(200);
        expect(res2).toHaveProperty('header');
      });
    });

    describe('/POST create', () => {
      it('successfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);
        const loginResponce: Ilogin = login.body as Ilogin;
        const expenseMock = {
          userId: loginResponce.user._id,
          categoryId: '6650d29a21f0205cce148ab0',
          amount: 100,
          currencyId: '6650cddc7cb8435306eb1a2e',
          details: 'test',
        };
        const res = await request(app.getHttpServer())
          .post('/expenses/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(expenseMock)
          .expect(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('userId');
        expect(res.body).toHaveProperty('currencyId');
        expect(res.body).toHaveProperty('categoryId');
        expect(res.body).toHaveProperty('amount');
        expect(res.body).toHaveProperty('details');
      });
      it('unsuccessfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);
        const loginResponce: Ilogin = login.body as Ilogin;
        const expenseMock = {
          userId: loginResponce.user._id,
          amount: 100,
        };
        const res = await request(app.getHttpServer())
          .post('/expenses/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(expenseMock)
          .expect(400);
        expect(res.body).toHaveProperty('message');
      });
    });
    describe('/PATCH update', () => {
      it('successfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);
        const loginResponce: Ilogin = login.body as Ilogin;
        const expenseMock = {
          userId: loginResponce.user._id,
          currencyId: '6650cddc7cb8435306eb1a2f',
          categoryId: '6650d29a21f0205cce148ab1',
          amount: 100,
          details: 'test',
        };
        const res = await request(app.getHttpServer())
          .post('/expenses/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(expenseMock)
          .expect(201);

        const updateExpenseMock = {
          amount: 200,
        };
        const resType: Iexpense = res.body as Iexpense;
        const resUpdate = await request(app.getHttpServer())
          .patch(`/expenses/update/${resType._id}`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(updateExpenseMock)
          .expect(200);
        expect(resUpdate.body).toHaveProperty('_id');
        expect(resUpdate.body).toHaveProperty('userId');
        expect(resUpdate.body).toHaveProperty('currencyId');
        expect(resUpdate.body).toHaveProperty('categoryId');
        expect(resUpdate.body).toHaveProperty('amount');
        expect(resUpdate.body).toHaveProperty('details');
      });

      it('unsuccessfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);
        const loginResponce: Ilogin = login.body as Ilogin;
        const expenseMock = {
          userId: loginResponce.user._id,
          currencyId: '6650cddc7cb8435306eb1a2f',
          categoryId: '6650d29a21f0205cce148ab1',
          amount: 100,
          details: 'test',
        };
        const res = await request(app.getHttpServer())
          .post('/expenses/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(expenseMock)
          .expect(201);

        const resType: Iexpense = res.body as Iexpense;
        const resUpdate = await request(app.getHttpServer())
          .patch(`/expenses/update/${resType._id}`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send({})
          .expect(400);
        expect(resUpdate.body).toHaveProperty('message');
      });
    });

    describe('/DELETE remove', () => {
      it('successfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);
        const loginResponce: Ilogin = login.body as Ilogin;
        const expenseMock = {
          userId: loginResponce.user._id,
          currencyId: '6650cddc7cb8435306eb1a2f',
          categoryId: '6650d29a21f0205cce148ab1',
          amount: 100,
          details: 'test',
        };
        const res = await request(app.getHttpServer())
          .post('/expenses/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(expenseMock)
          .expect(201);
        const resType: Iexpense = res.body as Iexpense;

        const res2 = await request(app.getHttpServer())
          .delete(`/expenses/delete/${resType._id}`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .expect(200);
        expect(res2).toHaveProperty('header');
      });

      it('unsuccessfull', async () => {
        const userMock = {
          email: 'string@gmail.com',
          password: 'Q*123qw231eqw23e132qwe',
        };
        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send(userMock)
          .expect(201);
        const loginResponce: Ilogin = login.body as Ilogin;
        const expenseMock = {
          userId: loginResponce.user._id,
          currencyId: '6650cddc7cb8435306eb1a2f',
          categoryId: '6650d29a21f0205cce148ab1',
          amount: 100,
          details: 'test',
        };
        await request(app.getHttpServer())
          .post('/expenses/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(expenseMock)
          .expect(201);

        const res = await request(app.getHttpServer())
          .delete(`/expenses/delete/`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .expect(404);
        expect(res).toHaveProperty('header');
      });
    });
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
    await redisServer.stop();
  });
});
