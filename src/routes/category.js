/** @format */

import express from 'express';
import {
    deleteCategory,
    getAllCategory,
    postCategory,
    updateCategory,
} from '../controllers/category.js';

const router = express.Router();

router.get('/category', getAllCategory);

router.post('/category', postCategory);

router.patch('/category/:id', updateCategory);

router.delete('/category/:id', deleteCategory);

export default router;
