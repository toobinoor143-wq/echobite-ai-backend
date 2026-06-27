const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Routes Import
const cartRoutes = require("./routes/cartRoutes");
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const searchRoutes = require("./routes/searchRoutes");
const addressRoutes = require("./routes/addressRoutes");
const discountRoutes = require("./routes/discountRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const User = require("./models/user");
const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/lawapp')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// User Schema




// ========== SIGNUP ==========
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();
    res.json({ success: true, user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== LOGIN ==========
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔐 Login attempt:", email);
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      'mySecretKey',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ========== TEST ROUTE ==========
app.get('/', (req, res) => {
  res.send('✅ Server is running!');
});

// ========== ALL ROUTES HERE (Listen se pehle)=========
app.use('/api/foods', foodRoutes);
app.use("/api/cart", cartRoutes); // Ab ye bilkul sahi jagah par hai!
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/review", require("./routes/reviewRoutes"));
app.use("/api/search", searchRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/discount", discountRoutes);
app.use("/api", voiceRoutes);
app.use("/api/admin", adminRoutes);
// ========== START SERVER (Sirf ek baar) ==========
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🛒 Cart API: POST http://localhost:${PORT}/api/cart/add`);
  console.log('login API: POST http://localhost:5000/api/auth/login')
});