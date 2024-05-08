import { Document, Schema, model } from 'mongoose';
import { FurnitureDocumentInterface } from './furniture.js';
import { CustomerDocumentInterface } from './customer.js';
import { ProviderDocumentInterface } from './provider.js';

/**
 * @brief Interface to represent the Transaction model
 * @interface TransactionDocumentInterface
 * @param {ProviderDocumentInterface | CustomerDocumentInterface} participantId - The ID of the participant
 * @param {'Sale To Customer' | 'Purchase To Provider' | 'Return To Provider' | 'Return From Customer'} transactionType - The type of the transaction
 * @param {Date} dateTime - The date and time of the transaction
 * @param {number} totalAmount - The total amount of the transaction
 * @param {string} details - The details of the transaction
 * @param {Array<{furnitureId: FurnitureDocumentInterface, quantity: number}>} furniture - The furniture of the transaction
 * @returns {TransactionDocumentInterface} - The transaction document
 */
interface TransactionDocumentInterface extends Document {
  participantId: ProviderDocumentInterface | CustomerDocumentInterface; // Puede ser el ID de un cliente o un proveedor
  transactionType: 'Sale To Customer' | 'Purchase To Provider' | 'Return To Provider' | 'Return From Customer',
  dateTime: Date,
  totalAmount: number,
  details?: string,
  furniture: Array<{
    furnitureId: FurnitureDocumentInterface;
    quantity: number;
  }>,
}

/**
 * @brief Schema for the Transaction model
 * @constant TransactionSchema
 * @type {Schema<TransactionDocumentInterface>}
 * @returns {TransactionDocumentInterface} - The transaction document
 * 
 */
export const TransactionSchema = new Schema<TransactionDocumentInterface>({
  participantId: { 
    type: Schema.Types.ObjectId, 
    required: true 
  }, 
  transactionType: { 
    type: String, 
    enum: ['Sale To Customer', 'Purchase To Provider', 'Return To Provider', 'Return From Customer'], 
    required: true 
  },
  dateTime: { 
    type: Date, 
    default: Date.now 
  },
  totalAmount: { 
    type: Number, 
    default: 0
  },
  details: { 
    type: String 
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

export const Transaction = model<TransactionDocumentInterface>('Transaction', TransactionSchema);