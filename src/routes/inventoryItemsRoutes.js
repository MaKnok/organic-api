import express from 'express';
import InventoryItemController from "../controllers/inventoryItemsController.js";

const router = express.Router();

router.get('/inventoryItems', InventoryItemController.listInventoryItems);
router.get('/inventoryItems/:catId/:itemId', InventoryItemController.listInventoryItemsById);
router.post('/inventoryItems/:catId', InventoryItemController.registerNewItem);
router.put('/inventoryItems/:catId/:itemId', InventoryItemController.updateItem);
router.delete('/inventoryItems/:catId/:itemId', InventoryItemController.deleteItem);
export default router;



