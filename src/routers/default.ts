import express from 'express';

export const defaultRouter = express.Router();

/**
 * Method to handle all requests to the server
 * @param {Request} req - The request to the server
 * @param {Response} res - The response from the server
 * @returns {Response} - The response from the server
 */
defaultRouter.all('*', (_, res) => {
  res.status(501).send();
});