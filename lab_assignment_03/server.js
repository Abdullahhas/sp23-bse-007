const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session")



const app = express();

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


app.get("/admin/home", async (req, res) => {

  if (!req.session.user) {
    return res.redirect("/login");
  }

  const Product = require('./models/alkaramproduct');
  let prods = await Product.find()

  res.render("index" , {prods , user : req.session.user});
});



