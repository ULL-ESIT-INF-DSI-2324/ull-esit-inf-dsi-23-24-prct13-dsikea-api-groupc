import request from 'supertest';
import { Provider } from "../src/models/provider.js";
import { app } from "../src/index.js";

const firstProvider = {
  name: "juan carlos",
  cif: "20086250Z",
  email: "juanca@example.com",
  mobilePhone: "123456789"
};

const secondProvider = {
  name: "carmen",
  cif: "12345678A"
};

beforeEach(async () => {
  await Provider.deleteMany();
  await new Provider(firstProvider).save();
});

describe('PROVIDERS', () => {

  context('GET /providers', () => {
    it('Should get a user by cif', async () => {
      await request(app).get('/providers?cif=20086250Z').expect(200);
    });
    it('Should get a user by id', async () => {
      const newProvider = await new Provider(secondProvider).save();
      await request(app).get('/providers?id=' + newProvider._id).expect(200);
    });
    it('Should get a user by id using the route "/providers/id:"', async () => {
      const newProvider = await new Provider(secondProvider).save();
      await request(app).get(`/providers/${newProvider._id}`).expect(200);
    });
    it('Should not find a user by username', async () => {
      await request(app).get('/providers?cif=84207410V').expect(404);
    });
    it('Should not find a user by id', async () => {
      await request(app).get('/providers?id=60d4d4c5e6b8f1b1d4b2b3b5').expect(404);
    });
    it('Should get an error', async () => {
      await request(app).get('/providers').expect(400);
    });
    it('Should get an user by cif', async () => {
      await new Provider(secondProvider).save();
      await request(app).get('/providers?cif=12345678A').expect(200);
    });
    it('Should get an user by id', async () => {
      const newProvider = await new Provider(secondProvider).save();
      await request(app).get('/providers?id=' + newProvider._id).expect(200);
    });
    it('Should get an user by id using the route "/providers/id:"', async () => {
      const newProvider = await new Provider(secondProvider).save();
      await request(app).get(`/providers/${newProvider._id}`).expect(200);
    });
    it('Should not find an user by username', async () => {
      await request(app).get('/providers?cif=12345678A').expect(404);
    });
  });
  context('POST /providers', () => {
    it('Should successfully create a new user', async () => {
      await request(app).post('/providers').send({
        name: "Victoria Martínez",
        cif: "10101141E",
        email: "vmartinez@example.com",
        furniture: []
      }).expect(201);
    });
    it('Should successfully create a new provider', async () => {
      await request(app)
        .post('/providers')
        .send(secondProvider)
        .expect(201);
    });
    it('Should not create a new provider', async () => {
      await request(app)
        .post('/providers')
        .send(firstProvider)
        .expect(500);
    });
    it('Should not create a new provider', async () => {
      await request(app)
        .post('/providers')
        .send({ name: 'juan carlos' })
        .expect(500);
    });
    it('Should get an error by trying to post an empty object', async () => {
      await request(app)
        .post('/providers')
        .send({})
        .expect(500);
    });
    it('Should get an error by trying to post a invalid format of email', async () => {
      await request(app)
        .post('/providers')
        .send({ name: 'juan carlos', email: 'juanca' })
        .expect(500);
    });
    it('Should get an error by trying to post a invalid format of cif', async () => {
      await request(app)
        .post('/providers')
        .send({ name: 'juan carlos', cif: '12345678' })
        .expect(500);
    });
    it('Should get an error by trying to post a invalid format of mobilePhone', async () => {
      await request(app)
        .post('/providers')
        .send({ name: 'juan carlos', mobilePhone: '123456' })
        .expect(500);
    });
    it('Should get an error by trying to post a invalid format of furniture', async () => {
      await request(app)
        .post('/providers')
        .send({ name: 'juan carlos', furniture: 'furniture' })
        .expect(500);
    });
    it('Should get an error by trying to post an existent provider', async () => {
      await request(app)
        .post('/providers')
        .send(firstProvider)
        .expect(500);
    });
  });

  context('PATCH /providers', () => {
    it('Should update a provider', async () => {
      await request(app)
        .patch('/providers?cif=20086250Z')
        .send({ name: 'carlos' })
        .expect(200);
    });
    it('Should not update a provider', async () => {
      await request(app)
        .patch('/providers?cif=12345678A')
        .send({ name: 'mariana' })
        .expect(404);
    });
    it('Should update a provider', async () => {
      const newProvider = await new Provider(secondProvider).save();
      await request(app)
        .patch(`/providers/${newProvider._id}`)
        .send({ name: 'mariana' })
        .expect(200);
    });
    it('Should not update a non existent provider', async () => {
      await request(app)
        .patch('/providers/60d4d4c5e6b8f1b1d4b2b3b5')
        .send({ name: 'mariana' })
        .expect(404);
    });
    it('Should not update a non allowed field', async () => {
      await request(app)
        .patch('/providers')
        .send({ cif: '12345678A' })
        .expect(400);
    });
    it('Should not update a non existent provider', async () => {
      await request(app)
        .patch('/providers')
        .send({ cif: '12345678A' })
        .expect(400);
    });
    it('Should not update a non allowed field', async () => {
      const newProvider = await new Provider(secondProvider).save();
      await request(app)
        .patch('/Providers')
        .query({ cif: newProvider.cif })
        .send({
          nif: '12345678'
        }).expect(400);
    });
    it('Should get an error by trying to update a furniture', async () => {
      await request(app)
        .patch('/providers')
        .send({ furniture: 'furniture' })
        .expect(400);
    });
    it('Should get an error by trying to update a invalid format of email', async () => {
      const newProvider = await new Provider(secondProvider).save();
      await request(app)
        .patch('/providers/' + newProvider._id)
        .send({ email: 'juanca' })
        .expect(500);
    });
  });

  context('DELETE /providers', () => {
    // it('Should delete a provider', async () => {
    //   const newProvider = await new Provider(secondProvider).save();
    //   await request(app)
    //     .delete('/providers')
    //     .query({ cif: newProvider.cif })
    //     .expect(200);
    // });
    it('Should not delete a non existent provider', async () => {
      await request(app)
        .delete('/providers')
        .query({ cif: '12345678A' })
        .expect(404);
    });
  });
});