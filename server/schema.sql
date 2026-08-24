-- Run: psql -U postgres -d ecommerce_admin -f schema.sql

-- 1. Categories (no dependencies)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Suppliers (no dependencies)
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Products (depends on categories + suppliers)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Users (no dependencies)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Orders (depends on users)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_amount NUMERIC(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL
);

-- 6. Payments (depends on orders)
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  method VARCHAR(20) DEFAULT 'card',
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP DEFAULT NOW()
);

-- Sample seed data
INSERT INTO categories (name, description) VALUES
('Electronics', 'Gadgets and devices'),
('Clothing', 'Apparel items');

INSERT INTO suppliers (name, email, phone, address) VALUES
('TechSupply Co', 'contact@techsupply.com', '03001234567', 'Lahore, PK');

INSERT INTO products (name, category_id, supplier_id, price, stock, description) VALUES
('Wireless Mouse', 1, 1, 15.99, 50, 'Ergonomic wireless mouse'),
('T-Shirt', 2, 1, 9.99, 100, 'Cotton t-shirt');

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@site.com', 'hashedpassword', 'admin'),
('John Doe', 'john@site.com', 'hashedpassword', 'customer');
