const express = require("express");
const router = express.Router();
const Category = require("../../models/category");
const isAuthenticated = require("../../middlewares/authenticated")


router.get("/admin/categories", isAuthenticated , async (req, res) => {
  
    
      
    const categories = await Category.find();
    res.render("admin/categories", { categories, layout: "layouts/panel" ,user : req.session.user });
  
});


router.get("/admin/categories/create", (req, res) => {
  res.render("admin/create-category", { layout: "layouts/panel" });
});


router.post("/admin/categories/create", async (req, res) => {

    const newCategory = new Category(req.body);
    await newCategory.save();
    res.redirect("/admin/categories");
  
});


router.get("/admin/categories/edit/:id", async (req, res) => {
  
    const category = await Category.findById(req.params.id);
   
    res.render("admin/edit-category", { category, layout: "layouts/panel" });
  
});


router.post("/admin/categories/edit/:id", async (req, res) => {
  
    await Category.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/admin/categories");
  
});


router.get("/admin/categories/delete/:id", async (req, res) => {
 
    await Category.findByIdAndDelete(req.params.id);
    res.redirect("/admin/categories");
 
  
});

module.exports = router;
