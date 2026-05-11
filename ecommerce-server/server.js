import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';
import productRoutes from './routes/products.js';
import deliveryOptionRoutes from './routes/deliveryOptions.js';
import cartItemRoutes from './routes/cartItems.js';
import orderRoutes from './routes/orders.js';
import resetRoutes from './routes/reset.js';
import paymentSummaryRoutes from './routes/paymentSummary.js';
import { Product } from './models/Product.js';
import { DeliveryOption } from './models/DeliveryOption.js';
import { CartItem } from './models/CartItem.js';
import { Order } from './models/Order.js';
import { defaultProducts } from './defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from './defaultData/defaultDeliveryOptions.js';
import { defaultCart } from './defaultData/defaultCart.js';
import { defaultOrders } from './defaultData/defaultOrders.js';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');
const hasFrontendBuild = fs.existsSync(indexPath);
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

function escapeRegex(value) {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

function matchesCorsOrigin(origin) {
  if (corsOrigins.length === 0) {
    return true;
  }

  return corsOrigins.some((allowedOrigin) => {
    if (!allowedOrigin.includes('*')) {
      return allowedOrigin === origin;
    }

    const pattern = `^${allowedOrigin
      .split('*')
      .map((segment) => escapeRegex(segment))
      .join('.*')}$`;
    return new RegExp(pattern).test(origin);
  });
}

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin || matchesCorsOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  }
}));
app.use(express.json());

// Serve images from the images folder
app.use('/images', express.static(path.join(__dirname, 'images')));
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/delivery-options', deliveryOptionRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/payment-summary', paymentSummaryRoutes);

if (hasFrontendBuild) {
  // Serve static files from the dist folder when a frontend build exists.
  app.use(express.static(distDir));

  // Catch-all route to serve index.html for any unmatched routes.
  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
} else {
  // Render is hosting the API only when the frontend is deployed separately.
  app.get('/', (req, res) => {
    res.json({
      service: 'ecommerce-backend',
      status: 'ok',
      frontend: 'Deploy the frontend separately and point it to this API service.',
      health: '/api/health'
    });
  });

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/images')) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    res.status(404).json({
      error: 'Frontend build not available on this service.',
      frontend: 'Deploy the frontend separately and point it to this API service.',
      health: '/api/health'
    });
  });
}

// Error handling middleware
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.message?.startsWith('CORS blocked for origin:')) {
    res.status(403).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Something went wrong!' });
});
/* eslint-enable no-unused-vars */

// Sync database and load default data if none exist
await sequelize.sync();

if (defaultCart.length === 0 && defaultOrders.length === 0) {
  await CartItem.destroy({ where: {} });
  await Order.destroy({ where: {} });
  console.log('Cleared persisted cart and order data on startup.');
}

const productCount = await Product.count();
if (productCount === 0) {
  const timestamp = Date.now();

  const productsWithTimestamps = defaultProducts.map((product, index) => ({
    ...product,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  const deliveryOptionsWithTimestamps = defaultDeliveryOptions.map((option, index) => ({
    ...option,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  const cartItemsWithTimestamps = defaultCart.map((item, index) => ({
    ...item,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  const ordersWithTimestamps = defaultOrders.map((order, index) => ({
    ...order,
    createdAt: new Date(timestamp + index),
    updatedAt: new Date(timestamp + index)
  }));

  await Product.bulkCreate(productsWithTimestamps);
  await DeliveryOption.bulkCreate(deliveryOptionsWithTimestamps);
  await CartItem.bulkCreate(cartItemsWithTimestamps);
  await Order.bulkCreate(ordersWithTimestamps);

  console.log('Default data added to the database.');
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
