import request from 'supertest';
import { Customer } from '../src/models/customer.js'
import { Provider } from '../src/models/provider.js'
import { Furniture } from '../src/models/furniture.js'
import { Transaction } from '../src/models/transaction.js'
import { app } from '../src/index.js';
import { expect } from 'chai';


const CustomerOne = {
  name: "Pepito",
  nif: "83309636W",
  email: "adrilgrc@example.com"
}

const CustomerSecond = {
  name: "Hola",
  nif: "46661796V",
}

const ProviderOne = {
  name: "Carlos III",
  cif: "B19559624",
  email: "juanca@example.com",
  mobilePhone: "123456789"
};

const ProviderSecond = {
  name: "carmen",
  cif: "U51396885"
};

const FurnitureOne = {
  name: "Sofa",
  description: "comfy sofa",
  color: 'blue',
  price: 20,
  stock: 10
}

const FurnitureSecond = {
  name: "Red Chair",
  description: "Wooden",
  color: 'red',
  price: 50,
  stock: 5
}

beforeEach(async () => {
  await Transaction.deleteMany();
});

describe('TRANSACTIONS', () => {

  context('GET /transactions', () => {
    it('should a transactions by id', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
     
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app).get(`/transactions/${transaction!._id}`).expect(200);
    });
    it('Should return transactions by type', async () => {
      request(app).get('/transactions?type=Sale To Customer').expect(200);
    });
    it('Should return transactions by date', async () => {
      request(app).get('/transactions?date=2021-06-01').expect(200);
    });
    it('Should return transactions by nif', async () => {
      request(app).get('/transactions?nif=46661796V').expect(200);
    });
    it('Should return transactions by cif', async () => {
      request(app).get('/transactions?cif=B19559624').expect(200);
    });
    it('Should return transactions by /transactions/:id', async () => {
      const provider = await new Provider(ProviderOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  provider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app).get(`/transactions/${transaction!._id}`).expect(200);
    });
    it('Should return 404 if the transaction is not found', async () => {
      request(app).get('/transactions/60b1f7b3b3f3b3b3b3b3b3b').expect(404);
    });
    it('Should return 404 if the transaction type is not found', async () => {
      request(app).get('/transactions?type=Invalid').expect(404);
    });
    it('Should return 404 if the date is not found', async () => {
      request(app).get('/transactions?date=2021-06-02').expect(404);
    });
    it('Should return 404 if the nif is not found', async () => {
      request(app).get('/transactions?nif=12345678B').expect(404);
    });
    it('Should return 404 if the cif is not found', async () => {
      request(app).get('/transactions?cif=U51396885').expect(404);
    });
  });

  context('POST /transactions', () => {
    it('should create a new transaction Sale To Customer', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();

      request(app)
        .post('/transactions')
        .send({
          participantId: customer._id,
          transactionType: 'Sale To Customer',
          furniture: [
            {
              furnitureId: furniture._id,
              quantity: 2
            }
          ]
        }).expect(201);
    });
    it('Should create a new transaction with the correct amount', async () => {
      const furniture = await new Furniture(FurnitureOne).save();
      const provider = await request(app)
        .post('/providers')
        .send({
          name: "Carlos III",
          cif: "B19559624",
          furniture: [{
            furnitureId: furniture._id,
            quantity: 2
          }]
        });
      
      const response = await request(app)
        .post('/transactions')
        .send({
          participantId: provider.body._id,
          transactionType: 'Purchase To Provider',
          furniture: [
            {
              furnitureId: furniture._id,
              quantity: 2
            }
          ]
        });
      expect(response.body.totalAmount).to.equal(40);
    });
    it('Should return 400 if the type its invalid', async () => {
      const provider = await new Provider(ProviderOne).save();
      const furniture = await new Furniture(FurnitureOne).save();

      request(app)
        .post('/transactions')
        .send({
          participantId: provider._id,
          transactionType: 'Invalid',
          furniture: [
            {
              furnitureId: furniture._id,
              quantity: 2
            }
          ]
        }).expect(400);
    });
    it('Should return 400 if participant is not a provider in Purchase To Provider', async () => {
      const customer = await new Customer(CustomerSecond).save();
      const furniture = await new Furniture(FurnitureOne).save();

      request(app)
        .post('/transactions')
        .send({
          participantId: customer._id,
          transactionType: 'Purchase To Provider',
          furniture: [
            {
              furnitureId: furniture._id,
              quantity: 2
            }
          ]
        }).expect(400);
    });
    it('Should return 400 if participant is not a customer in Sale To Customer', async () => {
      const provider = await new Provider(ProviderSecond).save();
      const furniture = await new Furniture(FurnitureOne).save();

      request(app)
        .post('/transactions')
        .send({
          participantId: provider._id,
          transactionType: 'Sale To Customer',
          furniture: [
            {
              furnitureId: furniture._id,
              quantity: 2
            }
          ]
        }).expect(400);
    });
    it('Should return 400 if the furniture is out of stock', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      furniture.stock = 0;
      await furniture.save();

      request(app)
        .post('/transactions')
        .send({
          participantId: customer._id,
          transactionType: 'Sale To Customer',
          furniture: [
            {
              furnitureId: furniture._id,
              quantity: 2
            }
          ]
        }).expect(400);
    });
    it('Should return 400 if the furniture items are required', async () => {
      const customer = await new Customer(CustomerOne).save();

      request(app)
        .post('/transactions')
        .send({
          participantId: customer._id,
          transactionType: 'Sale To Customer',
          furniture: []
        }).expect(400);
    });
    it('Should return 404 if the participant not found', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();

      request(app)
        .post('/transactions')
        .send({
          participantId: customer._id,
          transactionType: 'Sale To Customer',
          furniture: [
            {
              furnitureId: furniture._id,
              quantity: 2
            }
          ]
        }).expect(404);
    });
    it('Should create a new transaction Purchase To Provider', async () => {
      const provider = await new Provider(ProviderOne).save();
      const furniture = await new Furniture(FurnitureOne).save();

      request(app)
        .post('/transactions')
        .send({
          participantId: provider._id,
          transactionType: 'Purchase To Provider',
          furniture: [
            {
              furnitureId: furniture._id,
              quantity: 2
            }
          ]
        }).expect(201);
    });
    it('Should return 400 if the furniture are not found', async () => {
      const provider = await new Provider(ProviderOne).save();

      request(app)
        .post('/transactions')
        .send({
          participantId: provider._id,
          transactionType: 'Purchase To Provider',
          furniture: [
            {
              furnitureId: "60b1f7b3b3f3b3b3b3b3b3b3",
              quantity: 2
            }
          ]
        }).expect(404);
    });
  });

  context('PATCH /transactions/:id', () => {
    it('should update a transaction', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app)
        .patch(`/transactions/${transaction._id}`)
        .send({
          transactionType: 'Purchase To Provider'
        }).expect(200);
    });
    it('should return 404 if the transaction is not found', async () => {
      request(app)
        .patch('/transactions/60b1f7b3b3f3b3b3b3b3b3b')
        .send({
          transactionType: 'Purchase To Provider'
        }).expect(404);
    });
    it('should return 400 if the type its invalid', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app)
        .patch(`/transactions/${transaction._id}`)
        .send({
          transactionType: 'Invalid'
        }).expect(400);
    }); 
    it('should return 400 if the participant is not a provider in Purchase To Provider', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app)
        .patch(`/transactions/${transaction._id}`)
        .send({
          transactionType: 'Purchase To Provider'
        }).expect(400);
    });
    it('should return 200 if the participant is a provider in Purchase To Provider', async () => {
      const provider = await new Provider(ProviderOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  provider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app)
        .patch(`/transactions/${transaction._id}`)
        .send({
          transactionType: 'Sale To Customer'
        }).expect(200);
    });
    it('should return 400 if the participant is not a customer in Sale To Customer', async () => {
      const provider = await new Provider(ProviderOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  provider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app)
        .patch(`/transactions/${transaction._id}`)
        .send({
          transactionType: 'Sale To Customer'
        }).expect(400);
    });
    it('should return 200 if the participant is a customer in Sale To Customer', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app)
        .patch(`/transactions/${transaction._id}`)
        .send({
          transactionType: 'Purchase To Provider'
        }).expect(200);
    });
    it('should return 400 if the furniture is out of stock', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      furniture.stock = 0;
      await furniture.save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app)
        .patch(`/transactions/${transaction._id}`)
        .send({
          transactionType: 'Purchase To Provider'
        }).expect(400);
    });

    it('should return 200 to change a given furniture with other', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const furniture2 = await new Furniture(FurnitureSecond).save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app)
        .patch(`/transactions/${transaction._id}`)
        .send({
          furniture: [{
            furnitureId: furniture2._id,
            quantity: 2
          }]
        }).expect(200);
    });
    it('should return 200 to change a details of a given furniture', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          details: "new details",
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app)
        .patch(`/transactions/${transaction._id}`)
        .send({
          furniture: [{
            furnitureId: furniture._id,
            details: "new details 1",
            quantity: 3
          }]
        }).expect(200);
    });
  });
  context('DELETE /transactions/:id', () => {
    beforeEach(async() => {
      
    })
    it('should delete a transaction', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app).delete(`/transactions/${transaction._id}`).expect(200);
    });
    it('should return 404 if the transaction is not found', async () => {
      request(app).delete('/transactions/60b1f7b3b3f3b3b3b3b3b3b').expect(404);
    });
    it('Should delete a transaction and update the stock in Sale To Customer', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app).delete(`/transactions/${transaction._id}`);
      const updatedFurniture = await Furniture.findById(furniture._id);
      expect(updatedFurniture!.stock).to.equal(10);
    });
    it('Should not delete a transaction if the participant is not a customer in Sale To Customer', async () => {
      const provider = await new Provider(ProviderOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  provider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app).delete(`/transactions/${transaction._id}`).expect(400);
    });
    it('Should not delete a transaction if the participant is not a provider in Purchase To Provider', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app).delete(`/transactions/${transaction._id}`).expect(400);
    });
    it('Should not delete a transaction if the participant does not exist', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      await Customer.deleteMany();
      request(app).delete(`/transactions/${transaction._id}`).expect(404);
    });
    it('Should not delete a transaction if the furniture does not exist', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      await Furniture.deleteMany();
      request(app).delete(`/transactions/${transaction._id}`).expect(404);
    });
    it('Should not delete a transaction if the furniture is out of stock', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      furniture.stock = 0;
      await furniture.save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app).delete(`/transactions/${transaction._id}`).expect(400);
    });
    it('Should delete a transaction and update the quantity of Purchase To Provider', async () => {
      const provider = await new Provider(ProviderOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  provider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app).delete(`/transactions/${transaction._id}`);
      const updatedFurniture = await Furniture.findById(furniture._id);
      expect(updatedFurniture!.stock).to.equal(10);
    });
    it('Should delete a transaction and update the quantity of Sale To Customer', async () => {
      const customer = await new Customer(CustomerOne).save();
      const furniture = await new Furniture(FurnitureOne).save();
      const transactionjson =  {
        participantId :  customer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: furniture._id,
          quantity: 2
        }]
      }
      const transaction = await new Transaction(transactionjson);
      request(app).delete(`/transactions/${transaction._id}`);
      const updatedFurniture = await Furniture.findById(furniture._id);
      expect(updatedFurniture!.stock).to.equal(10);
    });
  });

});