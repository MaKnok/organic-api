import express from 'express';
import CategoryController from '../controllers/categoriesController.js';

const router = express.Router();

router.get("/categories", CategoryController.listCategories);
router.get("/categories/:id", CategoryController.listCategoriesById);
router.post("/categories", CategoryController.createNewCategory);
router.put("/categories/:id", CategoryController.updateCategory);
router.delete("/categories/:id", CategoryController.deleteCategory);

export default router;

