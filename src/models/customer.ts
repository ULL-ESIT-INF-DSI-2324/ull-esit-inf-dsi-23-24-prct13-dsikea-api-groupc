import { Document, Schema, model } from 'mongoose';
import { FurnitureDocumentInterface } from './furniture.js';
import validator from 'validator';

function calculateNIFLetter(nif) {
  let cadena = "TRWAGMYFPDXBNJZSQVHLCKET";
  nif = parseInt(nif);
  let posicion = nif % (cadena.length - 1);
  return cadena[posicion];
}

function validateSpanishNIF(value: string): boolean {
  const validFormats = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
  if (!validFormats.test(value)) {
    return false;
  }

  const letterProvided = value.charAt(8).toUpperCase();
  const numberPart = parseInt(value.substr(0, 8), 10);
  const calculatedLetter = calculateNIFLetter(numberPart);
  return letterProvided === calculatedLetter;
}

export interface CustomerDocumentInterface extends Document {
  name: string,
  nif: string,
  email?: string,
  mobilePhone?: number,
	furniture: Array<{
    furnitureId: FurnitureDocumentInterface;
    quantity: number;
  }>;
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
      if (!validateSpanishNIF(value)) {
        throw new Error('NIF is not valid');
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

export const Customer = model<CustomerDocumentInterface>('Customer', CustomerSchema);