import request from 'supertest';
import { Customer } from '../src/models/customer.js'
import { app } from '../src/index.js';

// const firstCustomer = {
//   name: "Adrian Lima",
//   nif: "24770104R",
//   email: "adrilgrc@example.com"
// }

const firstCustomer = {
  name: "carlos",
  nif: "20086250Z",
  furniture: [  
  ]
}

const secondCustomer = {
  name: "mariana",
  nif: "12345678A",
}

beforeEach(async () => {
  await Customer.deleteMany();
  // await new Customer(firstCustomer).save();
});

describe('CUSTOMERS', () => {

  context('GET /customers', () => {
    it('Should get a user by nif', async () => {
      await new Customer(firstCustomer).save();
      await request(app).get('/customers?nif=20086250Z').expect(200);
    });
    it('Should get a user by id', async () => {
      const newCustomer = await new Customer(firstCustomer).save();
      await request(app).get('/customers?id=' + newCustomer._id).expect(200);
    });
    it('Should get a user by id using the route "/customers/id:"', async () => {
      const newCustomer = await new Customer(firstCustomer).save();
      await request(app).get(`/customers/${newCustomer._id}`).expect(200);
    });
    it('Should not find a user by username', async () => {
      await request(app).get('/customers?nif=84207410V').expect(404);
    });
    it('Should not find a user by id', async () => {
      await request(app).get('/customers?id=60d4d4c5e6b8f1b1d4b2b3b5').expect(404);
    });
    it('Should get an error', async () => {
      await new Customer(firstCustomer).save();
      await request(app).get('/customers').expect(400);
    });
    it('Should get an user by nif', async () => {
      await new Customer(secondCustomer).save();
      await request(app).get('/customers?nif=12345678A').expect(200);
    });
    it('Should get an user by id', async () => {
      const newCustomer = await new Customer(secondCustomer).save();
      await request(app).get('/customers?id=' + newCustomer._id).expect(200);
    });
    it('Should get an user by id using the route "/customers/id:"', async () => {
      const newCustomer = await new Customer(secondCustomer).save();
      await request(app).get(`/customers/${newCustomer._id}`).expect(200);
    });
    it('Should not find an user by username', async () => {
      await request(app).get('/customers?nif=12345678A').expect(404);
    });
  });

  context('POST /customers', () => {
    it('Should successfully create a new user', async () => {
      await request(app).post('/customers').send({
        name: "Alejandro García",
        nif: "15082801E",
        email: "agarcia@example.com",
        furniture: []
      }).expect(201);
    });
    it('Should successfully create a new user', async () => {
      await request(app).post('/customers').send(secondCustomer).expect(201);
    });
    it('Should successfully create a new user', async () => {
      await request(app).post('/customers').send(firstCustomer).expect(201);
    });
    it('Should get an error by trying to post a invalid format of email', async () => {
      await request(app).post('/customers').send({
        name: "Alejandro García",
        nif: "15082801E",
        email: "",
      }).expect(500);
    });
    it('Should get an error by trying to post a invalid format of nif', async () => {
      await request(app).post('/customers').send({
        name: "Alejandro García",
        nif: "15082801",
        email: "alejandro@example.com",
      }).expect(500);
    });
    it('Should get an error by trying to post a invalid format of mobilePhone', async () => {
      await request(app).post('/customers').send({
        name: "Alejandro García",
        nif: "15082801E",
        email: "alejandro@example.com",
        mobilePhone: 1,
      }).expect(500);
    });
    it('Should get an error by trying to post a invalid format of furniture', async () => {
      await request(app).post('/customers').send({
        name: "Alejandro García",
        nif: "15082801E",
        furniture: "furniture",
      }).expect(500);
    });
    it('Should get an error by trying to post an empty body', async () => {
      await request(app).post('/customers').send({}).expect(500);
    });
    it('Should get an error by trying to post an existent customer', async () => {
      await new Customer(firstCustomer).save();
      await request(app).post('/customers').send(firstCustomer).expect(500);
    });
    it('Should get an error by trying to post an existent customer', async () => {
      await new Customer(secondCustomer).save();
      await request(app).post('/customers').send(secondCustomer).expect(500);
    });
  });

  context('PATCH /customers', () => {
    it('Should update a user', async () => {
      const newCustomer = await new Customer(firstCustomer).save();
      await request(app)
        .patch('/customers')
        .query({ nif: newCustomer.nif })
        .send({
          email: 'newemail@example.com'
        }).expect(200);
    });
    it('Should not update a non existent user', async () => {
      await request(app)
        .patch('/customers')
        .query({ nif: '12345678A' })
        .send({
          email: 'newemail@example.com'
        }).expect(404);
    });
    it('Should update a user', async () => {
      const newCustomer = await new Customer(secondCustomer).save();
      await request(app)
        .patch('/customers')
        .query({ nif: newCustomer.nif })
        .send({
          email: 'newemail@example.com'
        }).expect(200);
    });
    it('Should not update a non allowed field', async () => {
      const newCustomer = await new Customer(firstCustomer).save();
      await request(app)
        .patch('/customers')
        .query({ nif: newCustomer.nif })
        .send({
          nif: '12345678A'
        }).expect(400);
    });
    it('Should update the name of a user', async () => {
      const newCustomer = await new Customer(firstCustomer).save();
      await request(app)
        .patch('/customers')
        .query({ nif: newCustomer.nif })
        .send({
          name: 'newname'
        }).expect(200);
    });
    it('Should get an error by trying to update a furniture', async () => {
      const newCustomer = await new Customer(firstCustomer).save();
      await request(app)
        .patch('/customers')
        .query({ nif: newCustomer.nif })
        .send({
          furniture: 'furniture'
        }).expect(400);
    });
    it('Should get an error by trying to update a invalid format of email', async () => {
      const newCustomer = await new Customer(firstCustomer).save();
      await request(app)
        .patch('/customers')
        .query({ nif: newCustomer.nif })
        .send({
          email: ''
        }).expect(500);
    });
    it('Should get an error by trying to update a invalid format of mobilePhone', async () => {
      const newCustomer = await new Customer(firstCustomer).save();
      await request(app)
        .patch('/customers')
        .query({ nif: newCustomer.nif })
        .send({
          mobilePhone: 1
        }).expect(500);
    });
    it('Should not update a non allowed field', async () => {
      const newCustomer = await new Customer(secondCustomer).save();
      await request(app)
        .patch('/customers')
        .query({ nif: newCustomer.nif })
        .send({
          nif: '12345678'
        }).expect(400);
    });
    it('Should not update a non allowed field', async () => {
      const newCustomer = await new Customer(secondCustomer).save();
      await request(app)
        .patch('/customers')
        .query({ nif: newCustomer.nif })
        .send({
          furniture: 'furniture'
        }).expect(400);
    });
  });

  context('DELETE /customers', () => {
    // it('Should delete a user', async () => {
    //   const newCustomer = await new Customer(firstCustomer).save();
    //   await request(app)
    //     .delete('/customers')
    //     .query({ nif: newCustomer.nif })
    //     .expect(200);
    // });
    it('Should not delete a non existent user', async () => {
      await request(app)
        .delete('/customers')
        .query({ nif: '12345678A' })
        .expect(404);
    });
    // it('Should delete a user', async () => {
    //   const newCustomer = await new Customer(secondCustomer).save();
    //   await request(app)
    //     .delete('/customers')
    //     .query({ nif: newCustomer.nif })
    //     .expect(200);
    // });
  });
});