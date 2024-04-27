import { Document, connect, model, Schema } from 'mongoose';
import validator from 'validator';

export interface FurnitureDocumentInterface extends Document {
  name: string,
  description: string,
  color: 'blue' | 'green' | 'red' | 'yellow' | 'magenta',
  price: number,
}

const FurnitureSchema = new Schema<FurnitureDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    enum: ['blue', 'green', 'red', 'yellow', 'magenta'],
  },
  price: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error('Price must be a positive number');
      }
    }
  }
});

export const Furniture= model<FurnitureDocumentInterface>('Furniture', FurnitureSchema);