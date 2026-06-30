const Food = require('../models/food');


// ================= ADD FOOD =================

exports.addFood = async (req, res) => {

    try {

        const food = await Food.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Food Added Successfully',
            food
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// ================= GET ALL FOODS =================

exports.getFoods = async (req, res) => {

    try {

        const foods = await Food.find();

        res.status(200).json({
            success: true,
            foods
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// ================= GET SINGLE FOOD =================

exports.getSingleFood = async (req, res) => {

    try {

        const food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food Not Found'
            });
        }

        res.status(200).json({
            success: true,
            food
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// ================= UPDATE FOOD =================

exports.updateFood = async (req, res) => {

    try {

        const food = await Food.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Food Updated Successfully',
            food
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};




// ================= DELETE FOOD =================

exports.deleteFood = async (req, res) => {

    try {

        await Food.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Food Deleted Successfully'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};