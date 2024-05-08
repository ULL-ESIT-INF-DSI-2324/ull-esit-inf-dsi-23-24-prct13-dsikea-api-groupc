import request from 'supertest';
import { Customer } from '../src/models/customer.js'
import { Provider } from '../src/models/provider.js'
import { Furniture } from '../src/models/furniture.js'
import { Transaction } from '../src/models/transaction.js'
import { app } from '../src/index.js';
import { expect } from 'chai';

const FurnitureSecond = {
  name: "Blue Chair",
  description: "Wooden",
  color: 'blue',
  price: 50,
  stock: 5
}
const ProviderOne = {
  name: "Carlos III",
  cif: "20086253Z",
  email: "juanca@example.com",
  mobilePhone: "123456789"
};

const CustomerSecond = {
  name: "Marcos Martinez",
  nif: "03708194L",
}

after(async () => {
  await Customer.deleteMany();
  await Provider.deleteMany();
  await Furniture.deleteMany();
  await Transaction.deleteMany();
});

describe('WORKFLOWS', () => {
  let newProvider;
  let newCustomer;
  let newFurniture;
  let newTransaction;
  let transactionjson;
  context('Creating a transaction of type Sale To Customer', () => {

    it('Should create succesfully a transaction', async () => {
      newCustomer = await request(app).post('/customers').send(CustomerSecond);
      newFurniture = await request(app).post('/furnitures').send(FurnitureSecond);
      
      transactionjson = {
        participantId: newCustomer.body._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture.body._id,
          quantity: 3
        }]
      };
      newTransaction = await request(app).post('/transactions').send(transactionjson);
      expect(newTransaction.status).to.equal(201);
      return;
    });
    
    it('Should update the stock of the furniture to 2', async () => {
      newCustomer = await request(app).post('/customers').send(CustomerSecond);
      newFurniture = await request(app).post('/furnitures').send(FurnitureSecond);
      
      transactionjson = {
        participantId: newCustomer.body._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture.body._id,
          quantity: 3
        }]
      };
      newTransaction = await request(app).post('/transactions').send(transactionjson);
      // Load data from the database
      let furnitures = await Furniture.findById(newTransaction.body.furniture[0].furnitureId);
      expect(furnitures!.stock).to.equal(2);
      return;
    });
    it('Should return the correct amount to 150', async () => {
      newCustomer = await request(app).post('/customers').send(CustomerSecond);
      newFurniture = await request(app).post('/furnitures').send(FurnitureSecond);
      newTransaction = await request(app).post('/transactions').send({
        participantId: newCustomer.body._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture.body._id,
          quantity: 3
        }]
      });
      expect(newTransaction.body.totalAmount).to.equal(150);
      return;
    });
    it('If I attempt to create a transaction with a stock of 0, it should return an error', async (done) => {
      newCustomer = await request(app).post('/customers').send(CustomerSecond);
      newFurniture = await request(app).post('/furnitures').send(FurnitureSecond);
      transactionjson = {
        participantId: newCustomer.body._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture.body._id,
          quantity: 7
        }]
      };
      
      newTransaction = await request(app).post('/transactions').send({
        participantId: newCustomer.body._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture.body._id,
          quantity: 3
        }]
      });
      // Load data from the database
      newFurniture = await Furniture.findById(newTransaction.body.furniture[0].furnitureId);
      const newTransactionFail = await request(app).post('/transactions').send(transactionjson);
      expect(newTransactionFail.status).to.equal(400);
      done();
    });
  });

  context('Creating a transaction of type Purchase To Provider', () => {
    it('Should not create succesfully a transaction', async () => {
      newProvider = await new Provider(ProviderOne).save();
      newFurniture = await new Furniture(FurnitureSecond).save();
      const newTransactionFail = await request(app).post('/transactions').send({
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      });
      expect(newTransactionFail.status).to.equal(400);
      return;
    });
   
    it('Should update the stock of the furniture to 10', async () => {
      newFurniture = await new Furniture(FurnitureSecond).save();
      const newProviderBody = {
        name: "Carlos III",
        cif: "20086253Z",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      }
      newProvider = await new Provider(newProviderBody).save();
      newTransaction = await request(app).post('/transactions').send({
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      });
      newFurniture = await Furniture.findById(newFurniture._id);
      expect(newFurniture.stock).to.equal(10);
      return;
    });
    it('Should return the correct amount to 250', async () => {
      newFurniture = await new Furniture(FurnitureSecond).save();
      const newProviderBody = {
        name: "Carlos III",
        cif: "20086253Z",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      }
      newProvider = await new Provider(newProviderBody).save();
      newTransaction = await request(app).post('/transactions').send({
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      });
      expect(newTransaction.body.totalAmount).to.equal(250);
      return;
    });
    it('If I attempt to create a transaction and the provider does not have the furniture, it should return an error', async (done) => {
      transactionjson = {
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      };
      newProvider = await new Provider(ProviderOne).save();
      newFurniture = await new Furniture(FurnitureSecond).save();
      newTransaction = await request(app).post('/transactions').send({
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      });
      const newTransactionFail = await request(app).post('/transactions').send(transactionjson);
      expect(newTransactionFail.status).to.equal(404);
      done();
    });
  });

  context('Deleting a transaction of type Sale To Customer', () => {
    it('Should delete the transaction', async () => {
      newCustomer = await request(app).post('/customers').send(CustomerSecond);
      newFurniture = await request(app).post('/furnitures').send(FurnitureSecond);
      newTransaction = await request(app).post('/transactions').send({
        participantId: newCustomer.body._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture.body._id,
          quantity: 3
        }]
      });
      const deleteTransaction = await request(app).delete(`/transactions/${newTransaction.body._id}`);
      expect(deleteTransaction.status).to.equal(200);
      return;
    });
    it('Should return an error if the participant does not exist', async () => {
      newCustomer = await request(app).post('/customers').send(CustomerSecond);
      newFurniture = await request(app).post('/furnitures').send(FurnitureSecond);
      newTransaction = await request(app).post('/transactions').send({
        participantId: newCustomer.body._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture.body._id,
          quantity: 3
        }]
      });
      await request(app).delete(`/customers/${newCustomer.body._id}`);
      const deleteTransactionFail = await request(app).delete(`/transactions/${newTransaction.body._id}`);
      expect(deleteTransactionFail.status).to.equal(404);
      return;
    });
    it('Should return an error if the participant does not have the furniture', async () => {
      newCustomer = await new Customer(CustomerSecond).save();
      newFurniture = await new Furniture(FurnitureSecond).save();
      newTransaction = await request(app).post('/transactions').send({
        participantId: newCustomer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 3
        }]
      });
      await request(app).delete(`/transactions/${newTransaction.body._id}`);
      const deleteTransactionFail = await request(app).delete(`/transactions/${newTransaction.body._id}`);
      expect(deleteTransactionFail.status).to.equal(404);
      return;
    });
  });

  context('Deleting a transaction of type Purchase To Provider', () => {
    it('Should delete the transaction', async () => {
      newFurniture = await new Furniture(FurnitureSecond).save();
      const newProviderBody = {
        name: "Carlos III",
        cif: "20086253Z",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      }
      newProvider = await new Provider(newProviderBody).save();
      newTransaction = await request(app).post('/transactions').send({
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      });
      const deleteTransaction = await request(app).delete(`/transactions/${newTransaction.body._id}`);
      expect(deleteTransaction.status).to.equal(200);
      return;
    });
    it('Should return an error if the participant does not exist', async () => {
      newFurniture = await new Furniture(FurnitureSecond).save();
      const newProviderBody = {
        name: "Carlos III",
        cif: "20086253Z",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      }
      newProvider = await new Provider(newProviderBody).save();
      newTransaction = await request(app).post('/transactions').send({
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      });
      await request(app).delete(`/providers/${newProvider._id}`);
      const deleteTransactionFail = await request(app).delete(`/transactions/${newTransaction.body._id}`);
      expect(deleteTransactionFail.status).to.equal(404);
      return;
    });
    it('Should return an error if the participant does not have the furniture', async () => {
      newFurniture = await new Furniture(FurnitureSecond).save();
      const newProviderBody = {
        name: "Carlos III",
        cif: "20086253Z",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      }
      newProvider = await new Provider(newProviderBody).save();
      newTransaction = await request(app).post('/transactions').send({
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      });
      newProvider.furniture = [];
      newProvider.save();
      const deleteTransactionFail = await request(app).delete(`/transactions/${newTransaction.body._id}`);
      expect(deleteTransactionFail.status).to.equal(400);
      expect(deleteTransactionFail.body.error).to.equal(`Attempting to return a furniture the provider does not have!`);
      return;
    });
  });

  context('Updating a transaction of type Sale To Customer', () => {
    it('Should update the transaction', async () => {
      newCustomer = await request(app).post('/customers').send(CustomerSecond);
      newFurniture = await request(app).post('/furnitures').send(FurnitureSecond);
      newTransaction = await request(app).post('/transactions').send({
        participantId: newCustomer.body._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture.body._id,
          quantity: 3
        }]
      });
      const updateTransaction = await request(app).patch(`/transactions/${newTransaction.body._id}`).send({
        furniture: [{
          furnitureId: newFurniture.body._id,
          quantity: 2
        }]
      });
      expect(updateTransaction.status).to.equal(200);
      return;
    });
    it('Should return an error if the participant does not exist', async () => {
      newCustomer = await request(app).post('/customers').send(CustomerSecond);
      newFurniture = await request(app).post('/furnitures').send(FurnitureSecond);
      newTransaction = await request(app).post('/transactions').send({
        participantId: newCustomer.body._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture.body._id,
          quantity: 3
        }]
      });
      await request(app).delete(`/customers/${newCustomer.body._id}`);
      const updateTransactionFail = await request(app).patch(`/transactions/${newTransaction.body._id}`).send({
        participantId: newCustomer.body._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture.body._id,
          quantity: 2
        }]
      });
      expect(updateTransactionFail.status).to.equal(400);
    });
    it('Should return an error if the participant does not have the furniture', async () => {
      newCustomer = await new Customer(CustomerSecond).save();
      newFurniture = await new Furniture(FurnitureSecond).save();
      newTransaction = await request(app).post('/transactions').send({
        participantId: newCustomer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 3
        }]
      });
      await request(app).delete(`/furnitures/${newFurniture._id}`);
      const updateTransactionFail = await request(app).patch(`/transactions/${newTransaction.body._id}`).send({
        participantId: newCustomer._id,
        transactionType: "Sale To Customer",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 2
        }]
      });
    });
  });  

  context('Updating a transaction of type Purchase To Provider', () => {
    it('Should update the transaction', async () => {
      newFurniture = await new Furniture(FurnitureSecond).save();
      const newProviderBody = {
        name: "Carlos III",
        cif: "20086253Z",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      }
      newProvider = await new Provider(newProviderBody).save();
      newTransaction = await request(app).post('/transactions').send({
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      });
      const updateTransaction = await request(app).patch(`/transactions/${newTransaction.body._id}`).send({
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 3
        }]
      });
      expect(updateTransaction.status).to.equal(200);
    });
    it('Should return an error if the participant does not exist', async () => {
      newFurniture = await new Furniture(FurnitureSecond).save();
      const newProviderBody = {
        name: "Carlos III",
        cif: "20086253Z",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      }
      newProvider = await new Provider(newProviderBody).save();
      newTransaction = await request(app).post('/transactions').send({
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      });
      await request(app).delete(`/providers/${newProvider._id}`);
      const updateTransactionFail = await request(app).patch(`/transactions/${newTransaction.body._id}`).send({
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 3
        }]
      });
      expect(updateTransactionFail.status).to.equal(400);
    });
    it('Should return an error if the participant does not have the furniture', async () => {
      newFurniture = await new Furniture(FurnitureSecond).save();
      const newProviderBody = {
        name: "Carlos III",
        cif: "20086253Z",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      }
      newProvider = await new Provider(newProviderBody).save();
      newTransaction = await request(app).post('/transactions').send({
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 5
        }]
      });
      await request(app).delete(`/furnitures/${newFurniture._id}`);
      const updateTransactionFail = await request(app).patch(`/transactions/${newTransaction.body._id}`).send({
        participantId: newProvider._id,
        transactionType: "Purchase To Provider",
        furniture: [{
          furnitureId: newFurniture._id,
          quantity: 3
        }]
      });
      expect(updateTransactionFail.status).to.equal(400);
    });
  });
});