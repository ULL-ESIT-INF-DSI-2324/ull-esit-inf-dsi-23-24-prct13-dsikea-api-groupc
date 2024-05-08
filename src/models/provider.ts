import { Document, Schema, model } from 'mongoose';
import { FurnitureDocumentInterface } from './furniture.js';
import validator from 'validator';

/**
 * Interface to model the Provider Schema.
 * @interface ProviderDocumentInterface
 * @param {string} name - The name of the provider.
 * @param {string} cif - The CIF of the provider.
 * @param {string} email - The email of the provider.
 * @param {number} mobilePhone - The mobile phone of the provider.
 * @param {Array<{furnitureId: FurnitureDocumentInterface, quantity: number}>} furniture - The furniture of the provider.
 */
export interface ProviderDocumentInterface extends Document {
  name: string,
  cif: string,
  email?: string,
  mobilePhone?: number,
  furniture: Array<{
    furnitureId: FurnitureDocumentInterface;
    quantity: number;
  }>;
}

/**
 * Interface to model the Provider Schema.
 * @interface ProviderDocumentInterface
 * @param {string} name - The name of the provider.
 * @param {string} cif - The CIF of the provider.
 * @param {string} email - The email of the provider.
 * @param {number} mobilePhone - The mobile phone of the provider.
 * @param {Array<{furnitureId: FurnitureDocumentInterface, quantity: number}>} furniture - The furniture of the provider.
 */
const ProviderSchema = new Schema<ProviderDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cif: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(value: string) {
      if (!validator.default.isLength(value, { min: 9, max: 9 })) {
        throw new Error('CIF must have 9 characters');
      }
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.default.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  mobilePhone: {
    type: Number,
    validate(value: number) {
      if (!validator.default.isMobilePhone(value.toString())) {
				throw new Error('Telephone is invalid');
			}
    }
  },
  furniture: [{
    furnitureId: {
      type: Schema.Types.ObjectId,
      ref: 'Furniture',
    },
    quantity: {
      type: Number,
    }
  }],
});

export const Provider = model<ProviderDocumentInterface>('Provider', ProviderSchema);