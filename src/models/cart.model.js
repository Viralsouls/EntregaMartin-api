import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1
                }
            }
        ],
        default: []
    }
});

cartSchema.pre('findOne', function() {
    this.populate('products.product', '-__v');
});

export const CartModel = mongoose.model('carts', cartSchema);