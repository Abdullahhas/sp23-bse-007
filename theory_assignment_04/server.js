const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session")

const Order = require("./models/order")
const isAuthenticated = require('./middlewares/authenticated')
const cookieParser = require("cookie-parser");

const Product = require("./models/alkaramproduct")
const Cart = require('./models/cart')




const app = express();
app.use(cookieParser("yourSecretKey"));

app.use(session({
  secret : "abd",
  resave : false,
  saveUninitialized : true
}))


app.use(express.static("public"));

app.use(express.static("uploads"));


app.set("view engine", "ejs");


app.use(expressLayouts);


app.use(express.urlencoded({ extended: true }));



const productsRouter = require("./routers/admin/products.router");
app.use(productsRouter); 

let categoryRouter = require("./routers/admin/category.router");

app.use(categoryRouter);

let userRouter = require("./routers/admin/loginAndSignUp")
app.use(userRouter)






let connectionString = "mongodb://localhost:27017/test";

mongoose
  .connect(connectionString)
  .then(() => {
    console.log(`Connected To: ${connectionString}`);
  })
  .catch((err) => {
    console.log(err.message);
  });



app.listen(3000, () => {
  console.log("Server started at localhost:3000");
});


// app.get("/categories/:slug", async (req,res,next)=>{
//   let Category = require("./models/category")
//   let category = await Category.findOne({slug:req.params.slug});
//   if(!category) return next();
//   let prods = await Product.find({category:category._id.toString()})
 
//   res.render("index" , {prods});
// })


app.get("/admin/home", isAuthenticated ,  async (req, res) => {

 

  const Product = require('./models/alkaramproduct');
  let prods = await Product.find()

  res.render("index" , {prods , user: req.user });
});



// Route to add product to cart based on product ID
app.post('/add-to-cart/:id', async (req, res) => {
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
app.get('/cart', async (req, res) => {
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
app.get('/checkout', async (req, res) => {
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
app.post('/checkout', async (req, res) => {
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


app.get('/order-success/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).send('Order not found');

    res.render('admin/order-success', { order , layout: "layouts/panel" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/orders', async (req, res) => {
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
app.get('/order-details/:id', async (req, res) => {
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








    