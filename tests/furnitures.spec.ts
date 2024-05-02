import request from 'supertest';
import { Furniture } from '../src/models/furniture.js'
import { app } from '../src/index.js';

// const firstCustomer = {
//   name: "Adrian Lima",
//   nif: "24770104R",
//   email: "adrilgrc@example.com"
// }
// 
const firstFurniture = {
  name: "Chair",
  description: "Wooden chair",
  color: 'blue',
  price: 20,
  stock: 10
}

const secondFurniture = {
  name: "Table",
  description: "Wooden table",
  color: 'red',
  price: 50,
  stock: 5
}


beforeEach(async () => {
  await Furniture.deleteMany();
  // await new Customer(firstCustomer).save();
});

describe('FURNITURES', () => {
  context('GET /furnitures', () => {
    it('Should create a new furniture', async () => {
      await request(app).post('/furnitures').send(firstFurniture).expect(201);
    });
    it('Should add the second furniture', async () => {
      await request(app).post('/furnitures').send(secondFurniture).expect(201);
    });
    it('Should create a new furniture. Particular case: Default stock', async () => {
      await request(app).post('/furnitures').send({
        name: "Chair",
        description: "Wooden chair",
        color: 'blue',
        price: 20
      }).expect(201);
    });
    it('Should not create a new furniture. Bad use: Empty body', async () => {
      await request(app).post('/furnitures').send({}).expect(400);
    });
    it('Should not create a new furniture. Bad use: Missing name', async () => {
      await request(app).post('/furnitures').send({ 
        description: "Wooden chair", 
        color: 'blue', 
        price: 20, 
        stock: 10 
    	}).expect(400);
    });
    it('Should not create a new furniture. Bad use: Missing description', async () => {
      await request(app).post('/furnitures').send({ 
        name: "Chair", 
        color: 'blue', 
        price: 20, 
        stock: 10 
    	}).expect(400);
    });
    it('Should not create a new furniture. Bad use: Wrong color', async () => {
      await request(app).post('/furnitures').send({ 
        name: "Chair", 
        description: "Plastic chair", 
        color: 'rainbow', 
        price: 20, 
        stock: 10 
    	}).expect(400);
    });
    it('Should not create a new furniture. Bad use: Negative price', async () => {
      await request(app).post('/furnitures').send({ 
        name: "Chair", 
        description: "Plastic chair", 
        color: 'blue', 
        price: -20, 
        stock: 10 
    	}).expect(400);
    });
  });

  context('GET /furnitures', () => {
    it('A furniture by id', async () => {
			const newFurniture = await new Furniture(firstFurniture).save();
      await request(app).get(`/furnitures?id=${newFurniture._id}`).expect(200);
    });
  });
  
});