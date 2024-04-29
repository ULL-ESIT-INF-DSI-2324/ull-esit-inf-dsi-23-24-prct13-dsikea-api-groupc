import request from 'supertest';
import { app } from '../src/index.js';

// describe('POST /customers', () => {
//   it('Should successfully create a new customer', async () => {
//     await request(app).post('/customer').send({
//       name: "Eduardo Segredo",
//       username: "esegredo",
//       email: "esegredo@example.com",
//     }).expect(201);
//   });
// });