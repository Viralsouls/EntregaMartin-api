import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    status: { type: Boolean, default: true },
    thumbnails: { type: [String], default: [] }
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model('products', productSchema);