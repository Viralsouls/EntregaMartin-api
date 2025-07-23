// src/models/ticket.model.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Usaremos UUID para códigos únicos

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: () => uuidv4(),
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String, // En un futuro, podría ser un ObjectId referenciando a un usuario
        required: true,
    }
});

export const TicketModel = mongoose.model('tickets', ticketSchema);