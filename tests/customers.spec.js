import request from 'supertest';
import { Customer } from '../src/models/customer.js';
import { app } from '../src/index.js';
const firstCustomer = {
    name: "Adrian Lima",
    username: "adrilgrc",
    nif: "24770104R",
    email: "adrilgrc@example.com"
};
beforeEach(async () => {
    await Customer.deleteMany();
});
describe('POST /customers', () => {
    it('Should successfully create a new customer', async () => {
        await request(app).post('/customers').send(firstCustomer).expect(201);
    });
    it('Should get an error', async () => {
        await request(app).post('/customers').send(firstCustomer).expect(500);
    });
});
describe('GET /customers', () => {
    it('Should get a user by ', async () => {
        await request(app).get('/customers?nif=24770104R').expect(200);
    });
    it('Should not find a user by username', async () => {
        await request(app).get('/customers?nif=84207410V').expect(404);
    });
});
