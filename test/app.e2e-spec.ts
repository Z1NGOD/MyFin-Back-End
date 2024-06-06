import { Test, type TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  ValidationPipe,
  type INestApplication,
} from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { RedisMemoryServer } from 'redis-memory-server';
import * as request from 'supertest';
import { BudgetType } from '@core/budgets/enum/budget.enum';
import { AppModule } from '../src/app.module';
import { type Ilogin } from './interfaces/ilogin.interface';
import { type Ibudget } from './interfaces/ibudget.interface';
import { type Iexpense } from './interfaces/iexpense.interface';

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
      imports: [AppModule],
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
          .expect(HttpStatus.CREATED);
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
          .expect(HttpStatus.BAD_REQUEST);
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
          .expect(HttpStatus.CREATED);
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
          .expect(HttpStatus.BAD_REQUEST);
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
          .expect(HttpStatus.CREATED);

        const loginResponce: Ilogin = login.body as Ilogin;
        const refreshTokenMock = { refreshToken: loginResponce.refreshToken };
        const res = await request(app.getHttpServer())
          .post('/auth/updateAccessToken')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(refreshTokenMock)
          .expect(HttpStatus.CREATED);
        expect(res.body).toHaveProperty('accessToken');
      });

      it('unsuccessfull', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/updateAccessToken')
          .send({})
          .expect(HttpStatus.FORBIDDEN);
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
          .expect(HttpStatus.CREATED);
        const loginResponce: Ilogin = login.body as Ilogin;

        const budgetMock = {
          userId: loginResponce.user._id,
          currencyId: '6650cddc7cb8435306eb1a2e',
          amount: 100,
          type: BudgetType.Week,
        };

        const res = await request(app.getHttpServer())
          .post('/budgets/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(budgetMock)
          .expect(HttpStatus.CREATED);

        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('userId');
        expect(res.body).toHaveProperty('currencyId');
        expect(res.body).toHaveProperty('amount');
        expect(res.body).toHaveProperty('type');
      });
      it('unsuccessfull', async () => {
        const budgetMock = {
          amount: 100,
        };
        const res = await request(app.getHttpServer())
          .post('/budgets/create')
          .send(budgetMock)
          .expect(HttpStatus.UNAUTHORIZED);
        expect(res.body).toHaveProperty('message');
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
          .expect(HttpStatus.CREATED);
        const loginResponce: Ilogin = login.body as Ilogin;

        const budgetMock = {
          userId: loginResponce.user._id,
          currencyId: '6650cddc7cb8435306eb1a2e',
          amount: 100,
          type: BudgetType.Week,
        };

        const res = await request(app.getHttpServer())
          .post('/budgets/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(budgetMock)
          .expect(HttpStatus.CREATED);

        const resFind: Ibudget = res.body as Ibudget;
        const res2 = await request(app.getHttpServer())
          .get(`/budgets/${resFind._id}`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .expect(HttpStatus.OK);
        expect(res2).toHaveProperty('header');
      });
      it('unsuccessfull', async () => {
        const budgetMock = {
          amount: 100,
        };
        const res = await request(app.getHttpServer())
          .post('/budgets/create')
          .send(budgetMock)
          .expect(HttpStatus.UNAUTHORIZED);
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
          .expect(HttpStatus.CREATED);

        const loginResponce: Ilogin = login.body as Ilogin;
        const updateBudgetMock = {
          amount: 200,
        };
        const budgetMock = {
          userId: loginResponce.user._id,
          currencyId: '6650cddc7cb8435306eb1a2e',
          amount: 100,
          type: BudgetType.Week,
        };

        const res = await request(app.getHttpServer())
          .post('/budgets/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(budgetMock)
          .expect(HttpStatus.CREATED);
        const resType: Ibudget = res.body as Ibudget;

        const res2 = await request(app.getHttpServer())
          .patch(`/budgets/update/${resType._id}`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(updateBudgetMock)
          .expect(HttpStatus.OK);
        expect(res2).toHaveProperty('header');
      });
    });
    it('unsuccessfull', async () => {
      const userMock = {
        email: 'string@gmail.com',
        password: 'Q*123qw231eqw23e132qwe',
      };
      const login = await request(app.getHttpServer())
        .post('/auth/login')
        .send(userMock)
        .expect(HttpStatus.CREATED);
      const loginResponce: Ilogin = login.body as Ilogin;
      const updateBudgetMock = {
        amount: 200,
      };
      const budgetMock = {
        userId: loginResponce.user._id,
        currencyId: '6650cddc7cb8435306eb1a2e',
        amount: 100,
        type: BudgetType.Week,
      };

      const res = await request(app.getHttpServer())
        .post('/budgets/create')
        .auth(loginResponce.accessToken, { type: 'bearer' })
        .send(budgetMock)
        .expect(HttpStatus.CREATED);
      const resType: Ibudget = res.body as Ibudget;

      const res2 = await request(app.getHttpServer())
        .patch(`/budgets/update/${resType._id}`)
        .send(updateBudgetMock)
        .expect(HttpStatus.UNAUTHORIZED);
      expect(res2.body).toHaveProperty('message');
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
          .expect(HttpStatus.CREATED);
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
          .expect(HttpStatus.CREATED);

        const res = await request(app.getHttpServer())
          .get(`/expenses`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .expect(HttpStatus.OK);
        expect(res).toHaveProperty('header');
      });
      it('unsuccessfull', async () => {
        const expenseMock = {
          userId: '',
          currencyId: '6650cddc7cb8435306eb1a2f',
          categoryId: '6650d29a21f0205cce148ab1',
          amount: 100,
          details: 'test',
        };
        const res = await request(app.getHttpServer())
          .post('/expenses/create')
          .send(expenseMock)
          .expect(HttpStatus.UNAUTHORIZED);
        expect(res.body).toHaveProperty('message');
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
          .expect(HttpStatus.CREATED);
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
          .expect(HttpStatus.CREATED);

        const resType: Iexpense = res.body as Iexpense;

        const res2 = await request(app.getHttpServer())
          .get(`/expenses/${resType._id}`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .expect(HttpStatus.OK);
        expect(res2).toHaveProperty('header');
      });
      it('unsuccessfull', async () => {
        const expenseMock = {
          userId: '',
          currencyId: '6650cddc7cb8435306eb1a2f',
          categoryId: '6650d29a21f0205cce148ab1',
          amount: 100,
          details: 'test',
        };
        const res = await request(app.getHttpServer())
          .post('/expenses/create')
          .send(expenseMock)
          .expect(HttpStatus.UNAUTHORIZED);
        expect(res.body).toHaveProperty('message');
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
          .expect(HttpStatus.CREATED);
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
          .expect(HttpStatus.CREATED);
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
          .expect(HttpStatus.CREATED);
        const loginResponce: Ilogin = login.body as Ilogin;
        const expenseMock = {
          userId: loginResponce.user._id,
          amount: 100,
        };
        const res = await request(app.getHttpServer())
          .post('/expenses/create')
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(expenseMock)
          .expect(HttpStatus.BAD_REQUEST);
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
          .expect(HttpStatus.CREATED);
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
          .expect(HttpStatus.CREATED);

        const updateExpenseMock = {
          amount: 200,
        };
        const resType: Iexpense = res.body as Iexpense;
        const resUpdate = await request(app.getHttpServer())
          .patch(`/expenses/update/${resType._id}`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send(updateExpenseMock)
          .expect(HttpStatus.OK);
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
          .expect(HttpStatus.CREATED);
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
          .expect(HttpStatus.CREATED);

        const resType: Iexpense = res.body as Iexpense;
        const resUpdate = await request(app.getHttpServer())
          .patch(`/expenses/update/${resType._id}`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .send({})
          .expect(HttpStatus.BAD_REQUEST);
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
          .expect(HttpStatus.CREATED);
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
          .expect(HttpStatus.CREATED);
        const resType: Iexpense = res.body as Iexpense;

        const res2 = await request(app.getHttpServer())
          .delete(`/expenses/delete/${resType._id}`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .expect(HttpStatus.OK);
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
          .expect(HttpStatus.CREATED);
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
          .expect(HttpStatus.CREATED);

        const res = await request(app.getHttpServer())
          .delete(`/expenses/delete/`)
          .auth(loginResponce.accessToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND);
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
