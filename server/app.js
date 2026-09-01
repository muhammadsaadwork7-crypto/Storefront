require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const categoriesRoutes = require('./routes/categories.routes');
const suppliersRoutes = require('./routes/suppliers.routes');
const productsRoutes = require('./routes/products.routes');
const usersRoutes = require('./routes/users.routes');
const ordersRoutes = require('./routes/orders.routes');
const paymentsRoutes = require('./routes/payments.routes');
const errorHandler = require('./middleware/errorHandler');
const cartRoutes = require('./routes/cart.routes');
const authRoutes = require('./routes/auth.routes');
const productMediaRoutes = require('./routes/productMedia.routes');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Serve uploaded product images statically at /uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/categories', categoriesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/product-media', productMediaRoutes);

app.get('/', (req, res) => res.send('API is running'));

// Error handler must be registered last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
