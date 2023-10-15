import mongoose from 'mongoose';

const sharedFieldsSchema = new mongoose.Schema({
    id: { type: String },
    itemName: { type: String, required: true },
    itemPrice: { type: Number, required: true },
    itemType: { type: String, required: true },
    date: { type: Date, required: true },
})

const catBeautySchema = new mongoose.Schema([sharedFieldsSchema]);

const catFoodSchema = new mongoose.Schema([sharedFieldsSchema]);

const catHealthSchema = new mongoose.Schema([sharedFieldsSchema]);

const catSupSchema = new mongoose.Schema([sharedFieldsSchema]);


const inventoryItemSchema = new mongoose.Schema({
    'cat-food': [catBeautySchema],
    'cat-health': [catFoodSchema],
    'cat-sup': [catHealthSchema],
    'cat-beauty': [catSupSchema],
});

const inventoryItems = mongoose.model('inventory-items', inventoryItemSchema);

export default inventoryItems;