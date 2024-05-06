import { Furniture } from '../models/furniture.js';
import express from 'express';

export const furnitureRouter = express.Router();

// COMANDO EJECUCIÓN DB Y RUTAS:
// sudo /home/usuario/dsi/13-dsikea/mongodb/bin/mongod --dbpath /home/usuario/dsi/13-dsikea/mongodb-data/

//-------------------------------------------------------------- GET --------------------------------------------------------------//
furnitureRouter.get('/furnitures', async (req, res) => {
  let filter = {}; 
  
  if (req.query.name && !req.query.description && !req.query.color) {
    filter = { name: req.query.name.toString() };
  }
  if (req.query.description && !req.query.name && !req.query.color) {
    filter = { description: req.query.description.toString() };
  }
  if (req.query.color && !req.query.name && !req.query.description) {
    filter = { color: req.query.color.toString() };
  }
  if (req.query.name && req.query.description) {
    filter = { name: req.query.name.toString(), description: req.query.description.toString() };
  }
  if (req.query.name && req.query.color) {
    filter = { name: req.query.name.toString(), color: req.query.color.toString() };
  }
  if (req.query.description && req.query.color) {
    filter = { description: req.query.description.toString(), color: req.query.color.toString() };
  }
  if (req.query.name && req.query.description && req.query.color) {
    filter = { name: req.query.name.toString(), description: req.query.description.toString(), color: req.query.color.toString() };
  }
  try {
    const furnitures = await Furniture.find(filter);
    if (furnitures && furnitures.length !== 0) {
      res.status(200).send(furnitures);
    } else {
      res.status(404).send('Furniture not found');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

furnitureRouter.get('/furnitures/:id', async (req, res) => {
  console.log("ID: ", req.params.id);
  try {
    const furniture = await Furniture.findById(req.params.id);
    if (furniture) {
      // console.log("Mueble: ", furniture);
      res.status(200).send(furniture);
    } else {
      res.status(404).send('Furniture not found');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//-------------------------------------------------------------- POST --------------------------------------------------------------//
furnitureRouter.post('/furnitures', async (req, res) => {
  const furniture = new Furniture(req.body);
  try {
    await furniture.save();
    res.status(201).send(furniture);
  } catch (err) {
    res.status(400).send(err);
  }
});

//-------------------------------------------------------------- PATCH --------------------------------------------------------------//
furnitureRouter.patch('/furnitures', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send('Name is required');
  }
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'description', 'color', 'price'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }
  try {
    const furniture = await Furniture.findOne(req.query);
    if (furniture) {
      updates.forEach(update => furniture[update] = req.body[update]);
      await furniture.save();
      res.send(furniture);
    } else {
      res.status(404).send('Furniture not found');
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

furnitureRouter.patch('/furnitures/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'description', 'color', 'price'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }
  try {
    const furniture = await Furniture.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (furniture) {
      res.send(furniture);
    } else {
      res.status(404).send('Furniture not found');
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

//-------------------------------------------------------------- DELETE --------------------------------------------------------------//
furnitureRouter.delete('/furnitures', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send('Name is required');
  }
  try {
    const furnitures = await Furniture.findOneAndDelete(req.query);
    if (furnitures) {
      res.status(200).send(furnitures);
    } else {
      res.status(404).send('Furniture not found');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

furnitureRouter.delete('/furnitures/:id', async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndDelete(req.params.id);
    if (furniture) {
      res.status(200).send(furniture);
    } else {
      res.status(404).send('Furniture not found');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});