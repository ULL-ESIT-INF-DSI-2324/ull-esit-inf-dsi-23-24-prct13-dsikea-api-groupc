import { Document, model, Schema } from 'mongoose';

/**
 * Interface to model the Furniture Schema.
 * @interface FurnitureDocumentInterface
 * @param {string} name - The name of the furniture.
 * @param {string} description - The description of the furniture.
 * @param {string} color - The color of the furniture.
 * @param {number} price - The price of the furniture.
 * @param {number} stock - The stock of the furniture.
 */
export interface FurnitureDocumentInterface extends Document {
  name: string,
  description: string,
  color: 'blue' | 'green' | 'red' | 'yellow' | 'magenta',
  price: number,
  stock: number,
}
/**
 * Interface to model the Furniture Schema.
 * @interface FurnitureDocumentInterface
 * @param {string} name - The name of the furniture.
 * @param {string} description - The description of the furniture.
 * @param {string} color - The color of the furniture.
 * @param {number} price - The price of the furniture.
 * @param {number} stock - The stock of the furniture.
 */
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
    required: true,
  }
});

export const Furniture= model<FurnitureDocumentInterface>('Furniture', FurnitureSchema);