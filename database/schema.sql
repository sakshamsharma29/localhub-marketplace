-- LocalHub Marketplace Database Schema
-- Run this in MySQL Workbench: Open SQL Script → Execute

DROP DATABASE IF EXISTS localhub;
CREATE DATABASE localhub;
USE localhub;

-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role ENUM('customer', 'business_owner', 'admin') DEFAULT 'customer',
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE businesses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  phone VARCHAR(20),
  email VARCHAR(150),
  website VARCHAR(255),
  logo VARCHAR(255),
  banner VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  category VARCHAR(100),
  image VARCHAR(255),
  images JSON,
  stock INT DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'piece',
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  business_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_method ENUM('cod', 'online', 'upi') DEFAULT 'cod',
  payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  business_id INT NOT NULL,
  order_id INT,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

-- ─────────────────────────────────────────────
-- SAMPLE USERS  (password for all = "password123")
-- ─────────────────────────────────────────────
INSERT INTO users (name, email, password, phone, address, role) VALUES
('Admin User',  'admin@localhub.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9999999999', 'Jaipur, Rajasthan', 'admin'),
('Ravi Kumar',  'ravi@localhub.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543210', 'Tonk Road, Jaipur', 'business_owner'),
('Sunita Devi', 'sunita@localhub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9812345678', 'MI Road, Jaipur',   'business_owner'),
('Arjun Singh', 'arjun@localhub.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9823456789', 'Malviya Nagar, Jaipur', 'business_owner'),
('Meena Sharma','meena@localhub.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9834567890', 'C-Scheme, Jaipur',  'business_owner'),
('Priya Sharma','priya@localhub.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9123456789', 'Vaishali Nagar, Jaipur', 'customer'),
('Rahul Gupta', 'rahul@localhub.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9145678901', 'Mansarovar, Jaipur', 'customer');

-- ─────────────────────────────────────────────
-- SAMPLE BUSINESSES
-- ─────────────────────────────────────────────
INSERT INTO businesses (owner_id, name, description, category, address, city, state, pincode, phone, email, rating, total_reviews, is_active) VALUES
(2, 'Ravi Fresh Vegetables',
 'Farm-fresh vegetables and fruits delivered daily from local farms. We source directly from farmers in the Jaipur region to bring you the freshest produce at the best prices.',
 'Grocery', 'Lal Kothi Market, Tonk Road', 'Jaipur', 'Rajasthan', '302015', '9876543210', 'ravi.fresh@email.com', 4.5, 128, TRUE),

(3, 'Sunita Organic Store',
 'Certified organic fruits, vegetables and pulses. No pesticides, no chemicals — just pure natural goodness grown with love. Trusted by 500+ families in Jaipur.',
 'Grocery', 'Jawahar Nagar, Civil Lines', 'Jaipur', 'Rajasthan', '302006', '9812345678', 'sunita.organic@email.com', 4.8, 214, TRUE),

(4, 'Pink City Bakery',
 'Authentic Rajasthani sweets and freshly baked items since 1995. Famous for our Ghewar, Malpua, and whole wheat breads. A Pink City institution loved by generations.',
 'Bakery', 'MI Road, Near GPO', 'Jaipur', 'Rajasthan', '302001', '9823456789', 'pinkcity.bakery@email.com', 4.7, 342, TRUE),

(5, 'Meena Sweet House',
 'Traditional Indian mithai and namkeen made fresh every morning. Our recipes have been passed down through 3 generations. Speciality: Kaju Katli and Besan Ladoo.',
 'Bakery', 'Bapu Bazar, Walled City', 'Jaipur', 'Rajasthan', '302003', '9834567890', 'meena.sweets@email.com', 4.6, 189, TRUE),

(2, 'Jaipur Dairy Fresh',
 'Pure cow milk, curd, paneer and ghee sourced from local gaushala. Delivered fresh every morning before 7am. No preservatives, no adulterants — just pure dairy.',
 'Dairy', 'Galta Gate, Near Gaushala', 'Jaipur', 'Rajasthan', '302003', '9876543211', 'jaipurdairy@email.com', 4.4, 97, TRUE),

(3, 'Rajasthani Masala Hub',
 'Authentic Rajasthani spices and masalas ground fresh in-store. Our secret blends have been perfecting Rajasthani cuisine for over 30 years. Lal Mirch is our speciality.',
 'Spices', 'Johari Bazar, Old City', 'Jaipur', 'Rajasthan', '302003', '9812345679', 'masalahub@email.com', 4.9, 276, TRUE),

(4, 'Fresh Meat Corner',
 'Fresh chicken, mutton and eggs sourced daily from local farms. Cleaned and cut fresh to order. Halal certified. Home delivery available across Jaipur.',
 'Meat', 'Sindhi Camp Area', 'Jaipur', 'Rajasthan', '302001', '9823456780', 'freshmeat@email.com', 4.3, 156, TRUE),

(5, 'City Pharmacy',
 'Your trusted neighbourhood pharmacy. All branded and generic medicines available. Free home delivery on orders above ₹500. Open 24x7 for emergencies.',
 'Pharmacy', 'Malviya Nagar Main Road', 'Jaipur', 'Rajasthan', '302017', '9834567891', 'citypharma@email.com', 4.6, 88, TRUE);

-- ─────────────────────────────────────────────
-- SAMPLE PRODUCTS
-- ─────────────────────────────────────────────

-- Ravi Fresh Vegetables (id=1)
INSERT INTO products (business_id, name, description, price, sale_price, category, image, stock, unit, is_active, is_featured) VALUES
(1,'Fresh Tomatoes','Red ripe farm-fresh tomatoes. Perfect for curries, salads and chutneys.',30.00,NULL,'Vegetables','https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80',150,'kg',TRUE,TRUE),
(1,'Spinach (Palak)','Tender fresh spinach leaves harvested this morning. Rich in iron and vitamins.',20.00,NULL,'Vegetables','https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',80,'bunch',TRUE,FALSE),
(1,'Potatoes','Fresh local potatoes. Ideal for sabzi, aloo paratha and chips.',25.00,20.00,'Vegetables','https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80',200,'kg',TRUE,TRUE),
(1,'Onions','Premium quality red onions. Essential for every Indian kitchen.',35.00,NULL,'Vegetables','https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',300,'kg',TRUE,FALSE),
(1,'Green Coriander','Fresh green coriander leaves. Adds flavour and aroma to any dish.',10.00,NULL,'Vegetables','https://images.unsplash.com/photo-1509622905150-fa66d3906e09?w=400&q=80',60,'bunch',TRUE,FALSE),
(1,'Cauliflower (Gobi)','Fresh white cauliflower. Great for gobi sabzi, paratha and manchurian.',40.00,35.00,'Vegetables','https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&q=80',50,'piece',TRUE,FALSE),
(1,'Green Peas (Matar)','Sweet tender green peas. Perfect for pulao, curry and snacks.',60.00,NULL,'Vegetables','https://images.unsplash.com/photo-1563208723-10b0f8310a89?w=400&q=80',40,'kg',TRUE,TRUE),
(1,'Carrots (Gajar)','Fresh orange carrots, great for halwa, salads and juices.',30.00,NULL,'Vegetables','https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',100,'kg',TRUE,FALSE),

-- Sunita Organic Store (id=2)
(2,'Organic Apples','Fresh organic apples from Himachal Pradesh. No wax, no chemicals. Sweet and crunchy.',180.00,160.00,'Fruits','https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80',60,'kg',TRUE,TRUE),
(2,'Organic Bananas','Organic bananas grown without pesticides. Rich in potassium and natural energy.',60.00,NULL,'Fruits','https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',80,'dozen',TRUE,FALSE),
(2,'Organic Moong Dal','Green moong dal grown organically. Protein-rich and easy to digest.',120.00,110.00,'Pulses','https://images.unsplash.com/photo-1585996940932-ef7e7e0c6e2c?w=400&q=80',100,'kg',TRUE,TRUE),
(2,'Organic Wheat Flour','Stone-ground whole wheat flour from organic farms. High in fibre.',80.00,NULL,'Grains','https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',150,'kg',TRUE,FALSE),
(2,'Organic Mangoes','Alphonso mangoes from certified organic orchards. The king of fruits!',350.00,300.00,'Fruits','https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80',30,'dozen',TRUE,TRUE),

-- Pink City Bakery (id=3)
(3,'Ghewar','Traditional Rajasthani sweet made with pure ghee and sugar syrup. A festive favourite.',150.00,NULL,'Sweets','https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&q=80',30,'piece',TRUE,TRUE),
(3,'Whole Wheat Bread','Freshly baked 100% whole wheat bread. No maida, no preservatives.',45.00,NULL,'Bread','https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',25,'loaf',TRUE,FALSE),
(3,'Butter Croissant','Flaky buttery croissants baked fresh every morning. Best with jam or cheese.',35.00,NULL,'Bread','https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',40,'piece',TRUE,TRUE),
(3,'Kachori','Crispy spicy kachoris filled with moong dal masala. Fresh and hot every morning.',15.00,NULL,'Snacks','https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',100,'piece',TRUE,TRUE),
(3,'Chocolate Cake','Moist dark chocolate cake with ganache frosting. Made to order for celebrations.',450.00,400.00,'Cakes','https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',10,'piece',TRUE,FALSE),

-- Meena Sweet House (id=4)
(4,'Kaju Katli','Premium kaju katli made with pure cashews and silver vark. Perfect for gifting.',600.00,550.00,'Sweets','https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&q=80',50,'250g',TRUE,TRUE),
(4,'Besan Ladoo','Traditional besan ladoo made with pure desi ghee. Melt-in-mouth texture.',300.00,NULL,'Sweets','https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',80,'500g',TRUE,TRUE),
(4,'Gulab Jamun','Soft spongy gulab jamuns soaked in rose-flavoured sugar syrup. Served warm.',120.00,NULL,'Sweets','https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',60,'plate',TRUE,FALSE),
(4,'Namkeen Mix','Rajasthani namkeen mix with dal moth, sev and papdi. Crunchy and spicy.',150.00,130.00,'Snacks','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80',100,'500g',TRUE,FALSE),

-- Jaipur Dairy Fresh (id=5)
(5,'Pure Cow Milk','Fresh cow milk from local gaushala. Delivered every morning before 7am.',60.00,NULL,'Dairy','https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80',200,'litre',TRUE,TRUE),
(5,'Fresh Paneer','Soft fresh paneer made daily from pure cow milk. Perfect for curries and snacks.',80.00,NULL,'Dairy','https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',50,'200g',TRUE,TRUE),
(5,'Desi Ghee','Pure desi cow ghee prepared traditionally. Rich aroma and golden colour.',650.00,NULL,'Dairy','https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80',30,'500ml',TRUE,FALSE),
(5,'Fresh Curd (Dahi)','Thick creamy curd set fresh every morning. Natural probiotic for gut health.',40.00,NULL,'Dairy','https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',80,'500g',TRUE,FALSE),
(5,'Buttermilk (Chaas)','Refreshing spiced buttermilk. Best summer drink — cooling and healthy.',20.00,NULL,'Dairy','https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',100,'500ml',TRUE,TRUE),

-- Rajasthani Masala Hub (id=6)
(6,'Lal Mirch Powder','Stone-ground pure red chilli powder. Bright colour and strong flavour. Rajasthan special.',120.00,100.00,'Spices','https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80',200,'500g',TRUE,TRUE),
(6,'Garam Masala','Freshly ground secret blend of 12 spices. Makes every dish extraordinary.',150.00,NULL,'Spices','https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&q=80',150,'250g',TRUE,TRUE),
(6,'Haldi (Turmeric)','Pure organic turmeric powder with high curcumin content. Bright yellow and earthy.',80.00,NULL,'Spices','https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',180,'500g',TRUE,FALSE),
(6,'Rajasthani Sabzi Masala','Special blend for Rajasthani vegetables. Used by local restaurants and homes.',130.00,110.00,'Spices','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',120,'250g',TRUE,TRUE),

-- Fresh Meat Corner (id=7)
(7,'Fresh Chicken (Whole)','Fresh whole chicken cleaned and dressed. Sourced from local farms daily.',180.00,160.00,'Chicken','https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80',30,'kg',TRUE,TRUE),
(7,'Mutton (Goat)','Fresh goat mutton cut to order. Tender and flavourful for biryani and curries.',650.00,600.00,'Mutton','https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80',15,'kg',TRUE,TRUE),
(7,'Farm Fresh Eggs','Free-range eggs from local farms. Rich yolk — a sign of freshness.',80.00,NULL,'Eggs','https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80',200,'dozen',TRUE,TRUE),

-- City Pharmacy (id=8)
(8,'Vitamin C 500mg','Immunity booster Vitamin C tablets. 30 tablets per pack.',120.00,99.00,'Vitamins','https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',100,'pack',TRUE,TRUE),
(8,'Paracetamol 500mg','Fast-acting paracetamol for fever and pain relief. 15 tablets strip.',25.00,NULL,'Medicines','https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80',500,'strip',TRUE,FALSE),
(8,'Hand Sanitizer','70% alcohol-based hand sanitizer. Kills 99.9% germs. 200ml bottle.',80.00,65.00,'Hygiene','https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&q=80',150,'bottle',TRUE,TRUE);

-- ─────────────────────────────────────────────
-- SAMPLE REVIEWS
-- ─────────────────────────────────────────────
INSERT INTO reviews (user_id, business_id, rating, comment) VALUES
(6,1,5,'Always fresh vegetables! Ravi bhai delivers on time and the quality is excellent.'),
(7,1,4,'Good quality tomatoes and potatoes. Prices are fair. Will order again.'),
(6,2,5,'Best organic store in Jaipur. Their mangoes are out of this world!'),
(7,3,5,'Pink City Bakery is legendary. The ghewar is absolutely divine!'),
(6,3,4,'Love the whole wheat bread. Fresh every morning and tastes amazing.'),
(7,4,5,'Meena ji ki kaju katli is the best in Jaipur. Pure ghee, premium quality.'),
(6,5,4,'Milk is delivered fresh every day. Paneer is very soft and fresh.'),
(7,6,5,'The lal mirch powder gives the perfect colour and flavour. Authentic Rajasthani taste!'),
(6,7,4,'Fresh chicken delivered quickly. Good quality and hygienically packed.'),
(7,8,5,'Great pharmacy with helpful staff. Fast delivery of medicines.');