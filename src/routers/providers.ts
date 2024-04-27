import { Provider } from "../models/provider.js";
import express from 'express';

export const providerRouter = express.Router();

providerRouter.get('/provider', (req, res) => {
  res.send('Providers list');
});