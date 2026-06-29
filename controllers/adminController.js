const User = require("../models/user");
const Food = require("../models/Food");
const Order = require("../models/order");

// Dashboard
const adminDashboard = async (req, res) => {
    try {

        const totalUsers = await User.countDocuments();
        const totalFoods = await Food.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find();

        let totalRevenue = 0;

        orders.forEach(order => {
            totalRevenue += order.totalPrice || 0;
        });

        res.json({
            success: true,
            totalUsers,
            totalFoods,
            totalOrders,
            totalRevenue
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {

        const users = await User.find().select("-password");

        res.json({
            success: true,
            totalUsers: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Orders
const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find();

        res.json({
            success: true,
            totalOrders: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Order
const getSingleOrder = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = req.body.status;

        await order.save();

        res.json({
            success: true,
            message: "Order status updated",
            order
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reports
const getReports = async (req, res) => {
    try {

        const orders = await Order.find();

        let revenue = 0;

        orders.forEach(order => {
            revenue += order.totalPrice || 0;
        });

        res.json({
            success: true,
            totalOrders: orders.length,
            revenue
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    adminDashboard,
    getAllUsers,
    getAllOrders,
    getSingleOrder,
    updateOrderStatus,
    deleteUser,
    getReports
};