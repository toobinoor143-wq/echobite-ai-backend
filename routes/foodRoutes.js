const express = require('express');

const router = express.Router();

const {
    addFood,
    getFoods,
    getSingleFood,
    updateFood,
    deleteFood
} = require('../controllers/foodController');


// Add Food
router.post('/add', addFood);


// Get All Foods
router.get('/', getFoods);


// Get Single Food
router.get('/:id', getSingleFood);


// Update Food
router.put('/update/:id', updateFood);


// Delete Food
router.delete('/delete/:id', deleteFood);



module.exports = router;