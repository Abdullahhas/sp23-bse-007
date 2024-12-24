const express = require("express");
const multer = require("multer");
const router = express.Router();
const authorize = require("../../middlewares/authorize");
const isAuthenticated = require("../../middlewares/authenticated");
const Product = require("../../models/alkaramproduct");
const Category = require("../../models/category")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});
const upload = multer({ storage: storage });

router.get("/admin/products/create",  authorize("admin") ,async (req, res) => {
  const categories = await Category.find();
  res.render("admin/createProd", { layout: "layouts/panel" , categories });
});


router.post("/admin/products/create", upload.single("file"), authorize("admin"), async (req, res) => {
  try {
   
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      picture: req.file ? req.file.filename : null, 
      isFeatured: Boolean(req.body.isFeatured),
      category: req.body.category,
    });

    
    await product.save();

   
    res.redirect("/admin/products");
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).send("Error creating product.");
  } 
});


router.get("/admin/products/edit/:id", authorize("admin", "editor"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category').exec();
    if (!product) {
      return res.status(404).send("Product not found.");
    }

    console.log("Product:", product); // Check the product's category
    
    const categories = await Category.find();
    res.render("admin/edit-product", { product, layout: "layouts/panel", categories });
  } catch (err) {
    console.error("Error fetching product for editing:", err);
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
router.get("/admin/products/:page?", isAuthenticated, async (req, res) => {
  let page = req.params.page ? Number(req.params.page) : 1;
  let pageSize = 2;
  let searchQuery = req.query.search || "";
  let minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
  let maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Infinity;
  let sortField = req.query.sort || "title";
  let sortOrder = req.query.order === "desc" ? -1 : 1;

  try {
    // Initialize search history in session if not present
    if (!req.session.searchHistory) {
      req.session.searchHistory = [];
    }

    // Save the current search query in session history if provided
    if (searchQuery && !req.session.searchHistory.includes(searchQuery)) {
      req.session.searchHistory.push(searchQuery);
    }

    let filter = {};

    // Search across multiple fields
    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Fetch products
    let products = await Product.find(filter)
      .sort({ [sortField]: sortOrder })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .populate("category")
      .exec();

    // Get total records and pages
    let totalRecords = await Product.countDocuments(filter);
    let totalPages = Math.ceil(totalRecords / pageSize);

    return res.render("admin/products", {
      products,
      user: req.session.user,
      layout: "layouts/panel",
      page,
      totalRecords,
      totalPages,
      searchQuery,
      minPrice,
      maxPrice,
      sortField,
      sortOrder,
      searchHistory: req.session.searchHistory, // Pass search history to the view
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).send("Error fetching products.");
  }
});






module.exports = router;
