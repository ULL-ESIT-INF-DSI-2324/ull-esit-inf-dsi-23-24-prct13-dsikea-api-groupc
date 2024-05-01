import { connect } from 'mongoose';

connect('mongodb+srv://dsiikea:dsiikea@ikearestapicluster.0xjelzj.mongodb.net/ikea-api').then(() => {
  console.log('Connection to MongoDB server established');
}).catch(() => {
  console.log('Unable to connect to MongoDB server');
});