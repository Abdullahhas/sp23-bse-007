const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Product = require('../../models/alkaramproduct'); 
const isAuthenticated = require("../../middlewares/authenticated")

// Add to Wishlist Route
router.get('/wishlist/add/:productId', async (req, res) => {
    if (!req.session.user) {
        req.session.message = 'Please log in to add items to your wishlist.';
        return res.redirect('/login');
    }

    const productId = req.params.productId;

    try {
        const user = await User.findById(req.session.user._id);
        if (!user) {
            console.error('User not found');
            return res.redirect('/login');
        }

        const product = await Product.findById(productId);
        if (!product) {
            console.error('Product not found');
            req.session.message = 'Product not found.';
            return res.redirect('/wishlist');
        }

        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        req.session.message = 'Product added to your wishlist.';
    } catch (err) {
        console.error('Error adding to wishlist:', err);
        req.session.message = 'An error occurred while adding to your wishlist.';
    }

    res.redirect('/wishlist');
});


router.get('/wishlist', isAuthenticated, async (req, res) => {
    console.log('Session User:', req.session.user); // Debugging
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(req.session.user._id).populate('wishlist');
        if (!user) {
            console.error('User not found in the database.');
            return res.redirect('/login');
        }
        res.render('admin/whislist', { wishlist: user.wishlist });
    } catch (err) {
        console.error('Error fetching wishlist:', err);
        res.status(500).send('An error occurred.');
    }
});



router.get('/wishlist/remove/:productId', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const productId = req.params.productId;

    try {
        const user = await User.findById(req.session.user._id);
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();
        req.session.message = 'Product removed from your wishlist.';
    } catch (err) {
        req.session.message = 'An error occurred while removing the product.';
    }

    res.redirect('/wishlist');
});


module.exports = router;
