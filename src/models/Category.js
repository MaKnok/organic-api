import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    id: {type:String},
    catId: {type:String, required:true},
    categoryName: {type:String, required:true}
});

const categories = mongoose.model('categories', categorySchema);

export default categories;