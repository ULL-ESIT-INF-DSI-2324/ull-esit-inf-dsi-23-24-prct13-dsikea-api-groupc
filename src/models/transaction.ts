import { Document, Schema, model } from 'mongoose';
import { FurnitureDocumentInterface } from './furniture.js';
import { CustomerDocumentInterface } from './customer.js';
import { ProviderDocumentInterface } from './provider.js';
import { Error as CallbackError } from 'mongoose';

/**
 * @brief Interface to represent the Transaction model
 */
interface TransactionDocumentInterface extends Document {
  participantId: ProviderDocumentInterface | CustomerDocumentInterface; // Puede ser el ID de un cliente o un proveedor
  transactionType: 'purchase' | 'sale' | 'providerReturn' | 'customerReturn';
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
    enum: ['purchase', 'sale', 'providerReturn', 'customerReturn'], 
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
    type: Schema.Types.ObjectId, 
    ref: 'Furniture', 
    required: true 
  }],
});

// Hook pre-save para calcular el totalAmount basado en los precios de los muebles
TransactionSchema.pre<TransactionDocumentInterface>('save', async function(next) {
  try {
    const furnitureDocs = await this.model('Furniture').find({ _id: { $in: this.furniture } }) as FurnitureDocumentInterface[];
    const totalAmount = furnitureDocs.reduce((acc, furniture) => acc + furniture.price, 0);
    this.totalAmount = totalAmount;
    next();
  } catch (error) { 
    next(error as CallbackError);
  }
});

export const Transaction = model<TransactionDocumentInterface>('Transaction', TransactionSchema);