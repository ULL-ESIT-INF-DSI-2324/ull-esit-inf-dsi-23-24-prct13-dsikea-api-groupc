import request from 'supertest';
import { Customer } from '../src/models/customer.js'
import { Provider } from '../src/models/provider.js'
import { Furniture } from '../src/models/furniture.js'
import { Transaction } from '../src/models/transaction.js'
import { app } from '../src/index.js';
import { expect } from 'chai';

const FurnitureSecond = {
  name: "Red Chair",
  description: "Wooden",
  color: 'red',
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
  name: "Hola",
  nif: "12345678B",
}

describe('WORKFLOWS', () => {

  context('Sale To Customer', () => {
  });

  context('Purchase To Provider', () => {
    
    it('should create a new transaction', async () => {
      const provider = await new Provider(ProviderOne).save();
    // const furniture = await new Furniture(FurnitureSecond).save();
    const transaction = {
      type: 'Purchase To Provider',
      provider: provider._id,
      furniture: [{
        furnitureId: "60b1f7b3b3f3b3b3b3b3b3b3",
        quantity: 1
      }]
    }
      request(app)
        .post('/transactions')
        .send(transaction)
        .expect(201)
    });
    it('Should create a new transaction with the correct amount', async () => {
      const provider = await new Provider(ProviderOne).save();
    // const furniture = await new Furniture(FurnitureSecond).save();
    const transaction = {
      type: 'Purchase To Provider',
      provider: provider._id,
      furniture: [{
        furnitureId: "60b1f7b3b3f3b3b3b3b3b3b3",
        quantity: 1
      }]
    }
      const response = await request(app)
        .post('/transactions')
        .send(transaction);
      
      console.log("RESPONSE: ", response.body.totalAmount);
      expect(response.body.totalAmount).to.equal(50);

      console.log("TRANSACTION: ", transaction);
      const amount = Furniture.findById(transaction.furniture[0].furnitureId);
      console.log("AMOUNT: ", amount);
    });
    it('should return 400 if participant is not a provider', async () => {
      const customer = await new Customer(CustomerSecond).save();
      request(app)
        .post('/transactions')
        .send({
          participantId: customer._id,
          transactionType: 'Purchase To Provider',
          furniture: [
            {
              furnitureId: "60b1f7b3b3f3b3b3b3b3b3b3",
              quantity: 2
            }
          ]
        }).expect(400);
    });
  });
});