CREATE DATABASE IF NOT EXISTS aeropaq_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aeropaq_db;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(30),
  address VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (full_name, email, phone, address, password_hash, role)
VALUES (
  'Administrador Aeropaq',
  'admin@aeropaq.com',
  '00000000',
  'Oficina central',
  '$2b$10$ydLfCmkcDnUDKi0xN6VVauPwA08jIUzXZeIlVjgjIwY35lMxvvyza',
  'admin'
)
ON DUPLICATE KEY UPDATE role = 'admin';

CREATE TABLE IF NOT EXISTS addresses (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  label VARCHAR(80) NOT NULL,
  country VARCHAR(80) NOT NULL,
  department VARCHAR(80),
  city VARCHAR(80) NOT NULL,
  address_line VARCHAR(255) NOT NULL,
  postal_code VARCHAR(20),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_addresses_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shipments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  tracking_code VARCHAR(80) NOT NULL UNIQUE,
  origin_address_id INT UNSIGNED,
  destination_address_id INT UNSIGNED,
  destination VARCHAR(255) NOT NULL,
  destination_region VARCHAR(120),
  status ENUM('created', 'received', 'in_transit', 'ready_for_pickup', 'delivered', 'cancelled') NOT NULL DEFAULT 'created',
  weight DECIMAL(10,2),
  price DECIMAL(10,2),
  estimated_cost DECIMAL(10,2),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_shipments_user_created_at (user_id, created_at),
  INDEX idx_shipments_region (destination_region),
  CONSTRAINT fk_shipments_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_shipments_origin_address
    FOREIGN KEY (origin_address_id) REFERENCES addresses(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_shipments_destination_address
    FOREIGN KEY (destination_address_id) REFERENCES addresses(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS shipment_events (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shipment_id INT UNSIGNED NOT NULL,
  status VARCHAR(60) NOT NULL,
  description VARCHAR(255),
  location VARCHAR(120),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_shipment_events_shipment
    FOREIGN KEY (shipment_id) REFERENCES shipments(id)
    ON DELETE CASCADE
);
