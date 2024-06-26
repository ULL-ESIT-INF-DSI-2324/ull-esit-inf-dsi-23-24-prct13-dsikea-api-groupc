import express from 'express';
import './db/mongoose.js';
import { customerRouter } from './routers/customers.js';
import { providerRouter } from './routers/providers.js';
import { furnitureRouter } from './routers/furnitures.js';
import { transactionRouter } from './routers/transactions.js';
import { defaultRouter } from './routers/default.js';

export const app = express();
app.use(express.json());
app.use(customerRouter);
app.use(providerRouter);
app.use(furnitureRouter);
app.use(transactionRouter);
app.use(defaultRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});