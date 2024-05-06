import { Customer } from "../models/customer.js";
import express from 'express';
import { Furniture } from "../models/furniture.js";

export const customerRouter = express.Router();

customerRouter.get('/customers', async (req, res) => {
  let filter = {};

  if (req.query.nif) {
    filter = { nif: req.query.nif.toString() };
  } else if (req.query.id) {
    filter = { _id: req.query.id.toString() };
  } else {
    return res.status(400).send({
      error: 'A nif or id must be provided',
    });
  }
  
  try {
    const customers = await Customer.find(filter);

    if (customers.length !== 0) {
      return res.send(customers);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

customerRouter.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      return res.status(200).send(customer);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

customerRouter.post('/customers', async (req, res) => {
  const customer = new Customer(req.body);
  try {
    await customer.save();
    return res.status(201).send(customer);
  } catch (error) {
    return res.status(500).send(error);
  }
});

customerRouter.patch('/customers', async (req, res) => {
  if (!req.query.nif) {
    return res.status(400).send({
      error: 'A nif must be provided',
    });
  }

  const allowedUpdates = ['name', 'email', 'mobilePhone'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const customer = await Customer.findOneAndUpdate({
      nif: req.query.nif.toString()
    },
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (customer) {
      return res.send(customer);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

customerRouter.patch('/customers/:id', async (req, res) => {
  const allowedUpdates = ['name', 'email', 'mobilePhone'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (customer) {
      return res.send(customer);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

customerRouter.delete('/customers', async (req, res) => {
  const filter = req.query.nif?{nif: req.query.nif.toString()}:{};

  try {
    const customer = await Customer.findOneAndDelete(filter);

    if (!customer) {
      return res.status(404).send({
        error: "Customer not found"
      });
    } else {
      return res.status(200).send(customer);
    }

  } catch (error) {
    return res.status(500).send(error);
  }
});

customerRouter.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).send({
        error: "Customer not found"
      });
    } else {
      return res.status(200).send(customer);
    }
    
  } catch (error) {
    return res.status(500).send(error);
  }
});