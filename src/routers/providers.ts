import { Provider } from "../models/provider.js";
import express from 'express';

export const providerRouter = express.Router();

providerRouter.get('/providers', async (req, res) => {
  const filter = req.query.cif?{cif: req.query.cif.toString()}:{};
  try {
    const providers = await Provider.find(filter);

    if (providers.length !== 0) {
      return res.send(providers);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

providerRouter.post('/providers', async (req, res) => {
  const provider = new Provider(req.body);
  try {
    await provider.save();
    return res.status(201).send(provider);
  } catch (error) {
    return res.status(500).send(error);
  }
});

providerRouter.patch('/providers', async (req, res) => {
  if (!req.query.cif) {
    return res.status(400).send({
      error: 'A cif must be provided',
    });
  }

  const allowedUpdates = ['name', 'email', 'mobilePhone', 'furniture'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const provider = await Provider.findOneAndUpdate({
      cif: req.query.cif.toString()
    },
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (provider) {
      return res.send(provider);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

providerRouter.delete('/providers', async (req, res) => {
  const filter = req.query.cif?{cif: req.query.cif.toString()}:{};

  try {
    const provider= await Provider.findOne(filter);

    if (!provider) {
      return res.status(404).send({
        error: "Provider not found"
      });
    }
    
    const furniture = await Provider.findOneAndDelete({
      _id: req.query.id
    }).populate({
      path: 'owner',
      select: ['cif']
    });

    if (furniture) {
      return res.send(furniture);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

