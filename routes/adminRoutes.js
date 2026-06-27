const express = require("express");
const router = express.Router();

const {
    adminDashboard,
    getAllUsers,
    getAllOrders,
    getSingleOrder,
    updateOrderStatus,
    deleteUser,
    getReports
} = require("../controllers/adminController");

router.get("/dashboard", adminDashboard);

router.get("/users", getAllUsers);

router.get("/orders", getAllOrders);

router.get("/order/:id", getSingleOrder);

router.put("/order/status/:id", updateOrderStatus);

router.delete("/user/:id", deleteUser);

router.get("/reports", getReports);

module.exports = router;