const express = require("express");
const multer = require("multer");
const router = express.Router();
const authorize = require("../../middlewares/authorize");
const Product = require("../../models/alkaramproduct");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});
const upload = multer({ storage: storage });

router.get("/admin/products/create", authorize("admin") , (req, res) => {
  res.render("admin/createProd", { layout: "layouts/panel" });
});


router.post("/admin/products/create", upload.single("file"), authorize("admin"), async (req, res) => {
  try {
   
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      picture: req.file ? req.file.filename : null, 
      isFeatured: Boolean(req.body.isFeatured),
    });

    
    await product.save();

   
    res.redirect("/admin/products");
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).send("Error creating product.");
  }
});


router.get("/admin/products/edit/:id",authorize("admin", "editor"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found.");
    }
    res.render("admin/edit-product", { product, layout: "layouts/panel" });
  } catch (err) {
    console.error("good");
    res.status(500).send("Error fetching product for editing.");
  }
});

router.post("/admin/products/edit/:id", async (req, res) => {
  try {
    let prod = await Product.findByIdAndUpdate(req.params.id, req.body);

    if (req.file) newProduct.picture = req.file.filename;
    newProduct.isFeatured = Boolean(req.body.isFeatured);
    await newProduct.save();

    res.redirect("/admin/products");
  } catch (err) {
    console.error("error");
    res.status(500).send("Error updating product.");
  }
});

router.get("/admin/products/delete/:id",authorize("admin"), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  return res.redirect("back");
});

router.get("/admin", (req, res) => {
  console.log("Dashboard route hit!");
  res.render("admin/dashboard", { layout: "layouts/panel" });
});


//pagination
// Pagination with sorting
router.get("/admin/products/:page?", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  let page = req.params.page ? Number(req.params.page) : 1;
  let pageSize = 2;
  let searchQuery = req.query.search || "";
  let minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0; // Get the minPrice from the query
  let sortField = req.query.sort || "title"; // Default sorting by title
  let sortOrder = req.query.order === "desc" ? -1 : 1; // Default to ascending order

  try {
    let filter = {};

    if (searchQuery) {
      filter.description = { $regex: searchQuery, $options: "i" }; // Filter by description
    }

    // Filter by price if minPrice is provided
    if (minPrice) {
      filter.price = { $gte: minPrice }; // Price greater than or equal to minPrice
    }

    let products = await Product.find(filter)
      .sort({ [sortField]: sortOrder }) // Apply sorting
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    let totalRecords = await Product.countDocuments(filter);
    let totalPages = Math.ceil(totalRecords / pageSize);

    return res.render("admin/products", {
      products,
      user: req.session.user,
      layout: "layouts/panel",
      page: page,
      totalRecords,
      totalPages,
      searchQuery,
      minPrice, // Pass minPrice back to the view
      sortField, // Pass sortField to the view
      sortOrder, // Pass sortOrder to the view
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).send("Error fetching products.");
  }
});





module.exports = router;
