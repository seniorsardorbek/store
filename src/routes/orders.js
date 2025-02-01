

import express from 'express';
import Order from '../schemas/Order.js';
import Product from '../schemas/Product.js';
import User from '../schemas/Users.js';
import {isLoggedIn} from "../auth/IsloggedIn.js"
const router = express.Router();
function removeDollarSign(amount) {
    return amount.replace('$', '');
  }
// Create Order
router.post('/orders', isLoggedIn , async (req, res) => {
  try {
    const {  products , quantity} = req.body;
const {id} = req.user || {};
    let totalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item);
      if (!product) return res.status(404).send({ message: 'Product not found' });

      if (product.quantity < item.quantity) {
        return res.status(400).send({ message: `Insufficient stock for ${product.name}` });
      }
      console.log(product);

      product.quantity -= quantity;
      await product.save();
console.log(removeDollarSign(product.price));
      totalPrice += +removeDollarSign(product.price) * quantity;
    }

    const order = new Order({ userId :id, products, totalPrice });
    await order.save();

    res.status(201).send({ data: order });
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

// Get All Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'fullname username')
      .populate('products', 'name price');

    res.status(200).send({ data: orders });
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

// Get Order by ID
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'fullname username')
      .populate('products.productId', 'name price');

    if (!order) return res.status(404).send({ message: 'Order not found' });

    res.status(200).send({ data: order });
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

// Update Order Status
router.patch('/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).send({ message: 'Order not found' });

    res.status(200).send({ data: order });
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

// Delete Order
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).send({ message: 'Order not found' });

    res.status(200).send({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

export default router;
