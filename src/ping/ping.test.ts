import req from 'supertest';
import { app } from '../server';

it('should ping a response', (done) => {
  req(app)
    .get('/ping')
    .expect(200, done);
});

it('should ping return the body as sent', (done) => {
  const body = { hello: 'world' };
  req(app)
    .get('/ping')
    .send(body)
    .expect(200)
    .end((err, res) => {
      if (err)done(err);
      expect(res.body)
        .toHaveProperty('body', body);
      done();
    });
});
