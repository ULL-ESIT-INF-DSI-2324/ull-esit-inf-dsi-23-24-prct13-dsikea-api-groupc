import { Document, Schema, model } from 'mongoose';
import { FurnitureDocumentInterface } from './furniture.js';
import { CustomerDocumentInterface } from './customer.js';
import { ProviderDocumentInterface } from './provider.js';
import validator from 'validator';


/**
 * @brief Interface to represent the Transaction model
 */
interface TransactionDocumentInterface extends Document {
  participantId: ProviderDocumentInterface | CustomerDocumentInterface; // Puede ser el ID de un cliente o un proveedor
  transactionType: 'purchase' | 'sale';
  dateTime: Date;
  totalAmount: number;
  details?: string;
  furniture: FurnitureDocumentInterface[],
}

export const TransactionSchema = new Schema<TransactionDocumentInterface>({
  participantId: { 
    type: Schema.Types.ObjectId, 
    required: true 
  }, // ID del cliente o proveedor
  transactionType: { 
    type: String, 
    enum: ['purchase', 'sale'], 
    required: true 
  },
  dateTime: { 
    type: Date, 
    default: Date.now 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  details: { 
    type: String 
  },
  furniture: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Furniture', 
    required: true 
  }],
});

export const Transaction = model<TransactionDocumentInterface>('Transaction', TransactionSchema);