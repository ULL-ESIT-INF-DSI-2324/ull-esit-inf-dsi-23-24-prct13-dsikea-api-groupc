import { Document, Schema, model } from 'mongoose';
import validator from 'validator';

export interface ProviderDocumentInterface extends Document {
  name: string,
  cif: string,
  email?: string,
  mobilePhone?: number,
}

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
});

export const Provider = model<ProviderDocumentInterface>('Provider', ProviderSchema);