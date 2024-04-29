import { Provider } from "../models/provider.js";
import express from 'express';

export const providerRouter = express.Router();

providerRouter.get('/provider', async (req, res) => {
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
