import request from 'supertest';
import { Furniture } from '../src/models/furniture.js'
import { app } from '../src/index.js';

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
  await new Furniture(firstFurniture).save();
});

describe('FURNITURES', () => {
  context('GET /furnitures', () => {
    it('A furniture by id', async () => {
			const newFurniture = await new Furniture(secondFurniture).save();
      await request(app).get(`/furnitures?id=${newFurniture._id}`).expect(200);
    });
    it('A furniture by name', async () => {
      await request(app).get(`/furnitures?name=${firstFurniture.name}`).expect(200);
    });
    it('A furniture by color', async () => {
      await request(app).get(`/furnitures?color=${firstFurniture.color}`).expect(200);
    });
    it('A furniture by description', async () => {
      await request(app).get(`/furnitures?description=${firstFurniture.description}`).expect(200);
    });
    it('A furniture by name and color', async () => {
      await request(app).get(`/furnitures?name=${firstFurniture.name}&color=${firstFurniture.color}`).expect(200);
    });
    it('A furniture by name and description', async () => {
      await request(app).get(`/furnitures?name=${firstFurniture.name}&description=${firstFurniture.description}`).expect(200);
    });
    it('A furniture by description and color', async () => {
      await request(app).get(`/furnitures?description=${firstFurniture.description}&color=${firstFurniture.color}`).expect(200);
    });
    it('A furniture by name, description and color', async () => {
      await request(app).get(`/furnitures?name=${firstFurniture.name}&description=${firstFurniture.description}&color=${firstFurniture.color}`).expect(200);
    });
    it('Should not find a furniture by name', async () => {
      await request(app).get(`/furnitures?name=Table`).expect(404);
    });
    it('Should not find a red furniture', async () => {
      await request(app).get(`/furnitures?color=red`).expect(404);
    });
  });

  context('POST /furnitures', () => {
    it('Should successfully create a new furniture', async () => {
      await request(app).post('/furnitures').send({
        name: " Red Chair",
        description: "Wooden chair",
        color: 'red',
        price: 20,
        stock: 10
      }).expect(201);
    });
    it('Should successfully create a new furniture', async () => {
      await request(app).post('/furnitures').send(secondFurniture).expect(201);
    });
    it('Should not create a new furniture', async () => {
      await request(app).post('/furnitures').send(firstFurniture).expect(400);
    });
    it('Should not create a new furniture', async () => {
      await request(app).post('/furnitures').send({}).expect(400);
    });
    it('Should add the second furniture', async () => {
      await request(app).post('/furnitures').send(secondFurniture).expect(201);
    });
    it('Should create a new furniture. Particular case: Default stock', async () => {
      await request(app).post('/furnitures').send({
        name: "Green Chair",
        description: "Wooden chair",
        color: 'green',
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

  context('PATCH /furnitures', () => {
    it('Should successfully update a furniture', async () => {
      const newFurniture = await new Furniture(secondFurniture).save();
      await request(app).patch(`/furnitures/${newFurniture._id}`).send({ price: 100 }).expect(200);
    });
    it('Should update a furniture', async () => {
      await request(app).patch(`/furnitures/${firstFurniture.name}`).send({ price: 100 }).expect(400);
    });
    it('Should not update a furniture. Bad use: Invalid id', async () => {
      await request(app).patch('/furnitures/123').send({}).expect(400);
    });
    it('Should not update a furniture. Bad use: price < 0', async () => {
      await request(app).patch('/furnitures/123').send({ price: -100 }).expect(400);
    });
    it('Should not update a non allowed field', async () => {
      await request(app).patch('/furnitures/123').send({ stock: -100 }).expect(400);
    });
    it('Should not update a furniture. Bad use: invalid color', async () => {
      await request(app).patch('/furnitures/123').send({ color: 'rainbow' }).expect(400);
    });
    it('Should update the description of the second furniture', async () => {
      const newFurniture = await new Furniture(secondFurniture).save();
      await request(app).patch(`/furnitures/${newFurniture._id}`).send({ description: 'Plastic chair' }).expect(200);
    });
    it('Should update the color of the second furniture', async () => {
      const newFurniture = await new Furniture(secondFurniture).save();
      await request(app).patch(`/furnitures/${newFurniture._id}`).send({ color: 'red' }).expect(200);
    });
    it('Should update the name of the second furniture', async () => {
      const newFurniture = await new Furniture(secondFurniture).save();
      await request(app).patch(`/furnitures/${newFurniture._id}`).send({ name: 'Red Table' }).expect(200);
    });
    it('Should not update the name of the second furniture. Bad use: name already exists', async () => {
      const newFurniture = await new Furniture(secondFurniture).save();
      await request(app).patch(`/furnitures/${newFurniture._id}`).send({ name: 'Chair' }).expect(400);
    });
  });

  context('DELETE /furnitures', () => {
    it('Should successfully delete a furniture', async () => {
      const newFurniture = await new Furniture(secondFurniture).save();
      await request(app).delete(`/furnitures/${newFurniture._id}`).expect(200);
    });
    it('Should not delete a furniture. Invalid id', async () => {
      await request(app).delete('/furnitures/123').expect(500);
    });
    it('Should delete the first furniture', async () => {
      await request(app).delete(`/furnitures?name=${firstFurniture.name}`).expect(200);
    });
    it('Should not delete a furniture. Bad use: Invalid name', async () => {
      await request(app).delete('/furnitures?name=Table').expect(404);
    });
    it('Should not delete a furniture by color', async () => {
      await request(app).delete('/furnitures?color=red').expect(400);
    });
    it('Should not delete a furniture by description', async () => {
      await request(app).delete('/furnitures?description=Wooden chair').expect(400);
    });
    it('Should not delete a furniture by name and color', async () => {
      await request(app).delete('/furnitures?name=Chair&color=blue').expect(200);
    });
    it('Should not delete a furniture by name and description', async () => {
      await request(app).delete('/furnitures?name=Chair&description=Wooden chair').expect(200);
    });
    it('Should not delete a furniture by description and color', async () => {
      await request(app).delete('/furnitures?description=Wooden chair&color=blue').expect(400);
    });
    it('Should not delete a furniture by name, description and color', async () => {
      await request(app).delete('/furnitures?name=Chair&description=Wooden chair&color=blue').expect(200);
    });
    it('Should delete the first furniture', async () => {
      await request(app).delete(`/furnitures?name=${firstFurniture.name}`).expect(200);
    });
  });
});