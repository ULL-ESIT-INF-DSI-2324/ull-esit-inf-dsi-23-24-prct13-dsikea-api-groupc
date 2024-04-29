import express from 'express';
import '../db/mongoose.js';
import { Transaction } from '../models/transaction.js';

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
  const transactionRouter = new Transaction(req.body);
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