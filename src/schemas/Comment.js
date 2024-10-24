import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    message: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product',
        required: true,
    },
   
} ,{
    versionKey: false,
    timestamps :{
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
