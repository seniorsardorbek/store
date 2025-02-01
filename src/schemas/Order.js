/** @format */

import mongoose from 'mongoose';

// Order Schema
const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        products: {
            type: mongoose.SchemaTypes.Array,
            ref: 'Product',
            required: true,
        },
        totalPrice: {
            type: mongoose.SchemaTypes.Number,
            required: true,
        },
        status: {
            type: mongoose.SchemaTypes.String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;