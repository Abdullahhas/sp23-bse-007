const express = require("express");
const multer = require("multer");
const router = express.Router();
const authorize = require("../../middlewares/authorize");
const Product = require("../../models/alkaramproduct");
const Order = require("../../models/order")
const Cart = require("../../models/cart")



router.post('/add-to-cart/:id', async (req, res) => {
    const productId = req.params.id;
  
    try {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).send('Product not found');
  
      // Find or create cart
      let cart = await Cart.findOne();
      if (!cart) {
        cart = new Cart({ products: [], totalPrice: 0 });
      }
  
      // Check if product is already in the cart
      const cartItemIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );
  
      if (cartItemIndex > -1) {
        // Update quantity
        cart.products[cartItemIndex].quantity += 1;
      } else {
        // Add new product
        cart.products.push({ productId, quantity: 1 });
      }
  
      // Update total price
      cart.totalPrice += product.price;
  
      await cart.save();
      res.redirect('/cart');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Get Cart
  router.get('/cart', async (req, res) => {
    try {
      const cart = await Cart.findOne().populate('products.productId');
      if (!cart) {
        return res.render('admin/cart', { products: [], totalPrice: 0  , layout: "layouts/panel"});
      }
  
      res.render('admin/cart', { products: cart.products, totalPrice: cart.totalPrice , layout: "layouts/panel" });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Checkout Page
  router.get('/checkout', async (req, res) => {
    try {
      const cart = await Cart.findOne();
      if (!cart) return res.redirect('/cart');
  
      res.render('admin/checkout', { totalPrice: cart.totalPrice , layout: "layouts/panel" });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Process Checkout
  router.post('/checkout', async (req, res) => {
    const { name, email, address, payment } = req.body;
  
    try {
      const cart = await Cart.findOne();
      if (!cart) return res.redirect('/cart'); // Ensure cart exists
  
      // Create the order with cart items and customer details
      const order = new Order({
        customer: {
          name,
          email,
          address
        },
        items: cart.items, // Pass cart items to the order
        totalPrice: cart.totalPrice, // Use the totalPrice from the cart
      });
  
      // Save the order to the database
      await order.save();
  
      // Clear the cart after the order is placed
      await Cart.deleteOne();
  
      // Redirect to order success page
      res.render('admin/order-success', { order, layout: "layouts/panel" }); // Pass the order object to the success page
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  router.get('/order-success/:orderId', async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) return res.status(404).send('Order not found');
  
      res.render('admin/order-success', { order , layout: "layouts/panel" });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.get('/orders', async (req, res) => {
    try {
      // Check if user is authenticated
   
  
      // Use the user's _id to find their orders
      const orders = await Order.find();
  
      res.render('admin/orders', { orders, layout: "layouts/panel" });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Route to get order details by order ID
  router.get('/order-details/:id', async (req, res) => {
    try {
      // Find the order by its ID
      const order = await Order.findById(req.params.id);
  
      // If the order is not found, return a 404 error
      if (!order) {
        return res.status(404).send('Order not found');
      }
  
      // Render the order details view, passing the order data
      res.render('admin/order-details', { order, layout: 'layouts/panel' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  
  
  
  
  