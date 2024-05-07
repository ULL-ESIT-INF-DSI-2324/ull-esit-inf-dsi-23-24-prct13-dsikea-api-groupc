import request from 'supertest';
import { Customer } from '../src/models/customer.js'
import { Provider } from '../src/models/provider.js'
import { Furniture } from '../src/models/furniture.js'
import { Transaction } from '../src/models/transaction.js'
import { app } from '../src/index.js';

const CustomerOne = {
  name: "Pepito",
  nif: "24780104R",
  email: "adrilgrc@example.com"
}

const CustomerSecond = {
  name: "Hola",
  nif: "12345678B",
}

const ProviderOne = {
  name: "Carlos III",
  cif: "20086253Z",
  email: "juanca@example.com",
  mobilePhone: "123456789"
};

const ProviderSecond = {
  name: "carmen",
  cif: "85782684A"
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

  context('POST /transactions', () => {
    it('should create a new transaction', async () => {
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
  });

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
      request(app).get('/transactions?nif=24780104R').expect(200);
    });
  });


  context('PATCH /transactions/:id', () => {
    
  });
  context('DELETE /transactions/:id', () => {

  });

});