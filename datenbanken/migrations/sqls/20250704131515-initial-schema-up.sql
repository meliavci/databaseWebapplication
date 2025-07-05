SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS shipments;
DROP TABLE IF EXISTS rental_order_items;
DROP TABLE IF EXISTS rental_orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS shopping_carts;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users
(
	id            INT AUTO_INCREMENT PRIMARY KEY,
	username      VARCHAR(255)           NOT NULL UNIQUE,
	email         VARCHAR(255)           NOT NULL UNIQUE,
	password_hash VARCHAR(255)           NOT NULL,
	role          ENUM ('user', 'admin') NOT NULL DEFAULT 'user',
	firstName     VARCHAR(255),
	lastName      VARCHAR(255),
	address       VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS products
(
	id              INT AUTO_INCREMENT PRIMARY KEY,
	name            VARCHAR(255)   NOT NULL,
	description     TEXT,
	category        VARCHAR(255),
	product_type    VARCHAR(255),
	price_per_month DECIMAL(10, 2) NOT NULL,
	image_url       VARCHAR(2048)
);

CREATE TABLE IF NOT EXISTS inventory_items
(
	id            INT AUTO_INCREMENT PRIMARY KEY,
	product_id    INT                          NOT NULL,
	serial_number VARCHAR(255) UNIQUE,
	status        ENUM ('available', 'rented') NOT NULL DEFAULT 'available',
	date_loan     DATE,
	date_return   DATE,
	borrowed_by   INT,
	FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
	FOREIGN KEY (borrowed_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS shopping_carts
(
	id         INT AUTO_INCREMENT PRIMARY KEY,
	user_id    INT                                       NOT NULL,
	created_at TIMESTAMP                                          DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP                                          DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	status     ENUM ('active', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items
(
	id                INT AUTO_INCREMENT PRIMARY KEY,
	cart_id           INT            NOT NULL,
	product_id        INT            NOT NULL,
	quantity          INT            NOT NULL,
	monthly_price     DECIMAL(10, 2) NOT NULL,
	rental_start_date DATE,
	rental_end_date   DATE,
	FOREIGN KEY (cart_id) REFERENCES shopping_carts (id) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rental_orders
(
	id           INT AUTO_INCREMENT PRIMARY KEY,
	user_id      INT                           NOT NULL,
	order_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	total_amount DECIMAL(10, 2)                NOT NULL,
	status       ENUM ('ongoing', 'completed') NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rental_order_items
(
	id                INT AUTO_INCREMENT PRIMARY KEY,
	order_id          INT            NOT NULL,
	inventory_item_id INT            NOT NULL,
	product_id        INT            NOT NULL,
	price             DECIMAL(10, 2) NOT NULL,
	rental_start_date DATE           NOT NULL,
	rental_end_date   DATE           NOT NULL,
	FOREIGN KEY (order_id) REFERENCES rental_orders (id) ON DELETE CASCADE,
	FOREIGN KEY (inventory_item_id) REFERENCES inventory_items (id),
	FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE IF NOT EXISTS shipments
(
	id              INT AUTO_INCREMENT PRIMARY KEY,
	order_id        INT                                                                              NOT NULL,
	tracking_number VARCHAR(255),
	carrier         VARCHAR(255)                                                                     NOT NULL,
	status          ENUM ('preparing', 'shipped', 'delivered', 'return_shipped', 'return_delivered') NOT NULL,
	date_shipped    TIMESTAMP                                                                        NULL,
	date_delivered  TIMESTAMP                                                                        NULL,
	FOREIGN KEY (order_id) REFERENCES rental_orders (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments
(
	id             INT AUTO_INCREMENT PRIMARY KEY,
	order_id       INT                                     NOT NULL,
	amount         DECIMAL(10, 2)                          NOT NULL,
	method         VARCHAR(255)                            NOT NULL,
	status         ENUM ('pending', 'completed', 'failed') NOT NULL,
	transaction_id VARCHAR(255),
	paid_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (order_id) REFERENCES rental_orders (id) ON DELETE CASCADE
);
