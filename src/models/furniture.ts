import { Document, model, Schema } from 'mongoose';

export interface FurnitureDocumentInterface extends Document {
  name: string,
  description: string,
  color: 'blue' | 'green' | 'red' | 'yellow' | 'magenta',
  price: number,
  stock: number,
}

const FurnitureSchema = new Schema<FurnitureDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true, 
    unique: true,
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
  },
  stock: {
    type: Number,
    default: 1,
  }
});

export const Furniture= model<FurnitureDocumentInterface>('Furniture', FurnitureSchema);