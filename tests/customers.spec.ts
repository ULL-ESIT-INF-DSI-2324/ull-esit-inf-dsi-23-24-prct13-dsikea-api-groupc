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

beforeEach(async () => {
  await Customer.deleteMany();
  // await new Customer(firstCustomer).save();
});

describe('POST /customers', () => {
  it('Should successfully create a new user', async () => {
    await request(app).post('/customers').send({
      name: "Alejandro García",
      nif: "15082801E",
      email: "agarcia@example.com",
      furniture: []
    }).expect(201);
  });
  it('Should get an error', async () => {
    await new Customer(firstCustomer).save();
    await request(app).post('/customers').send(firstCustomer).expect(500);
  });
});

describe('GET /customers', () => {
  it('Should get a user by ', async () => {
    await new Customer(firstCustomer).save();
    await request(app).get('/customers?nif=20086250Z').expect(200);
  });

  it('Should not find a user by username', async () => {
    await request(app).get('/customers?nif=84207410V').expect(404);
  });
});