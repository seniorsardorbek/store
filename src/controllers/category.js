/** @format */

import Category from '../schemas/Category.js';
export async function getAllCategory(req, res,) {
    try {
       
        let { limit = 100, skip = 0, q, by = 'created_at', order = 'asc' } = req.query || {}
        let filter = {}

        if (q) {
            filter = { title: { $regex: new RegExp(q, 'i') } }
        }

        limit = +limit
        skip = +skip

        const total = await Category.countDocuments(filter);
         const data  = await Category.find(filter).select('-created_at -updated_at ' ).populate('products' , "name price -categoryId -_id").sort({ [by] : order }).limit(limit).skip(limit * skip)




        res.status(200).send({ data  , total , limit , skip });
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
}

export async function postCategory(req, res, xt) {
    try {
        const titleExists = await Category.findOne({ title: req.body?.title });
        if (titleExists) {
            return res.status(400).send({ msg: 'Category already exists', success: false });
        }
        const category = new Category(req.body);
        await category.save();
        res.status(201).send({ data: category, msg: 'Category saved successfully' });
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
}


export async function updateCategory(req, res, xt) {
    try {
        const { id } = req.params;
        const titleExists = await Category.findOne({ title: req.body?.title });
        if (titleExists) {
            return res.status(400).send({ msg: 'Category already exists', success: false });
        }
        const category = await Category.findByIdAndUpdate(id, { ...req.body }, { new: true });

        res.status(201).send({ data: category, msg: 'Category updated successfully' });
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
}

export async function deleteCategory(req, res, xt) {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndDelete(id, { new: true });

        if (!category) {
            return res.status(404).send({ msg: 'Category not found', success: false });
        }
        res.status(201).send({ data: category, msg: 'Category updated successfully' });
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
}
