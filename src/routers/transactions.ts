import express from 'express';
import '../db/mongoose.js';
import { Transaction } from '../models/transaction.js';
import { Customer } from '../models/customer.js';
import { Furniture } from '../models/furniture.js';
import { Provider } from '../models/provider.js';

export const transactionRouter = express.Router();

transactionRouter.get('/transactions', async (req, res) => {
  const filter = req.query.participantId?{participantId: req.query.participantId.toString()}:{};
  try {
    const participant= await Transaction.find(filter);
  
    if (participant.length !== 0) {
      return res.send(participant);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

transactionRouter.get('/transactions/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const transaction = await Transaction.findOne({ _id });
    if (transaction) {
      return res.send(transaction);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

transactionRouter.post('/transactions', async (req, res) => {
  // Validate if the participantId exists
  const participantExists = await Customer.findById(req.body.participantId) || await Provider.findById(req.body.participantId);
  if (!participantExists) {
    return res.status(404).send({ error: 'Participant not found' });
  }
  
  const isProvider = await Provider.findById(req.body.participantId);
  const isCustomer = await Customer.findById(req.body.participantId);

  const furniture = req.body.furniture;
  let amount = 0;

  if (furniture.length === 0) {
    return res.status(400).send({ error: 'Furniture items are required' });
  }
  
  try {
  switch (req.body.transactionType) {
    case 'Sale To Customer' :
      if (isProvider) {
        return res.status(400).send({ error: 'Participant is not a customer' });
      }
      for (let i = 0; i < furniture.length; i++) {
        const furnitureItem = await Furniture.findById(furniture[i].furnitureId);
        if (furnitureItem!.stock === 0) {
          return res.status(400).send({ error: `Furniture item with ID ${furniture[i]} is out of stock` });
        } else {
          const foundFurniture = participantExists.furniture.find(furniture => furniture.furnitureId.toString() === furnitureItem!._id.toString());
          if (foundFurniture) {
            foundFurniture.quantity += furniture[i].quantity;
          } else {
            participantExists.furniture.push({ furnitureId: furnitureItem!._id, quantity: furniture[i].quantity });
          }
          amount += furnitureItem!.price as number * furniture[i].quantity as number;

          await participantExists.save();
          furnitureItem!.stock -= furniture[i].quantity as number;
          await furnitureItem!.save();
        }
      }
      break;
    case 'Purchase To Provider':
      if (isCustomer) {
        return res.status(400).send({ error: 'Participant is not a provider' });
      }
      for (let i = 0; i < furniture.length; i++) {
        const furnitureItem = await Furniture.findById(furniture[i].furnitureId);
        const foundFurniture = participantExists.furniture.find(furniture => furniture.furnitureId.toString() === furnitureItem!._id.toString());
        if (foundFurniture) {
          foundFurniture.quantity -= furniture[i].quantity;
        } else {
          participantExists.furniture.push({ furnitureId: furnitureItem!._id, quantity: furniture[i].quantity });
        }
        amount += furnitureItem!.price as number * furniture[i].quantity as number;

        await participantExists.save();
        furnitureItem!.stock += furniture[i].quantity as number;
        await furnitureItem!.save();
      }
      break;
    case 'Return From Customer':
      if (isProvider) {
        return res.status(400).send({ error: 'Participant is not a provider' });
      }
      for (let i = 0; i < furniture.length; i++) {
        const furnitureItem = await Furniture.findById(furniture[i].furnitureId);
        const foundFurniture = participantExists.furniture.find(furniture => furniture.furnitureId.toString() === furnitureItem!._id.toString());
        if (foundFurniture) {
          foundFurniture.quantity -= furniture[i].quantity;
        } else {
          return res.status(400).send({ error: `Client is trying to return a furniture (${furniture[i]}) they do not have!` });
        }
        await participantExists.save();
        furnitureItem!.stock += furniture[i].quantity as number;
        await furnitureItem!.save();
      }
      break;
    case 'Return To Provider':
      if (isCustomer) {
        return res.status(400).send({ error: 'Participant is not a provider' });
      }
      for (let i = 0; i < furniture.length; i++) {
        const furnitureItem = await Furniture.findById(furniture[i].furnitureId);
        const foundFurniture = participantExists.furniture.find(furniture => furniture.furnitureId.toString() === furnitureItem!._id.toString());
        if (foundFurniture) {
          console.log(foundFurniture.quantity, furniture[i].quantity);
          foundFurniture.quantity += furniture[i].quantity;
        } else {
          return res.status(400).send({ error: `Attempting to return a furniture (${furniture[i]}) the provider does not have!` });
        }
        await participantExists.save();
        furnitureItem!.stock -= furniture[i].quantity as number;
        await furnitureItem!.save();
      }
      break;
    default:
      return res.status(400).send({ error: 'Invalid transaction type' });
  }
} catch (error) {
  return res.status(500).send(error);
 }
  
  const transactionRouter = new Transaction(req.body);
  transactionRouter.totalAmount = amount;

  try {
    await transactionRouter.save();
    return res.status(201).send(transactionRouter);
  } catch (error) {
    return res.status(500).send(error);
  }
  
});

transactionRouter.delete('/transactions', async (req, res) => {
  const filter = req.query.id?{id: req.query.id.toString()}:{};

  try {
    const transaction = await Transaction.findOneAndDelete(filter);

    if (!transaction) {
      return res.status(404).send({
        error: "Transaction not found"
      });
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});


transactionRouter.patch('/transactions/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['date', 'details', 'furniture'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const transaction = await Transaction.findOneAndUpdate({
      _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true
      });
  
      if (transaction) {
        return res.send(transaction);
      }
      return res.status(404).send();
    } catch (error) {
      return res.status(500).send(error);
    }
});