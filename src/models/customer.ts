import { Document, Schema, model } from 'mongoose';
import { FurnitureDocumentInterface } from './furniture.js';
import validator from 'validator';

export interface CustomerDocumentInterface extends Document {
  name: string,
  nif: string,
  email?: string,
  mobilePhone?: number,
	furniture?: FurnitureDocumentInterface[],
}

const CustomerSchema = new Schema<CustomerDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nif: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(value: string) {
      if (!validator.default.isLength(value, { min: 9, max: 9 })) {
        throw new Error('NIF must have 9 characters');
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
		type: Schema.Types.ObjectId,
		ref: 'Furniture'
	}]
});

export const Customer = model<CustomerDocumentInterface>('Customer', CustomerSchema);