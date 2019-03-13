import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('(GET) /api/template/hello', () => {
    return request(app.getHttpServer())
      .get('/api/template/hello')
      .expect(200)
      .expect({
        message: 'Hello World!'
      });
  });
});
