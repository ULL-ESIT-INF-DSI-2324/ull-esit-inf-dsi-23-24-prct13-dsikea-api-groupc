import request from 'supertest';
import { Customer } from '../src/models/customer.js'
import { app } from '../src/index.js';

beforeEach(async () => {
  await Customer.deleteMany();
});
