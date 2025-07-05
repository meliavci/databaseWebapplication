import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the .env file in the project root
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import fs from 'fs/promises';
import mysql from 'mysql2/promise';
import { Product } from './models/product.models';

console.log(`[SEED] Loading .env file from: ${path.resolve(__dirname, '..', '.env')}`);

async function seedDatabase() {
	let connection: mysql.Connection | null = null;
	try {
		const dbConfig = {
			host: process.env['DB_HOST'],
			port: parseInt(process.env['DB_PORT'] || '3306'),
			user: process.env['DB_USER'],
			password: process.env['DB_PASSWORD'],
			database: process.env['DB_DATABASE'],
			certPath: process.env['DB_SSL_CERT_PATH'],
		};

		// Validate that all required environment variables are loaded
		for (const [key, value] of Object.entries(dbConfig)) {
			if (!value) {
				const envVarName = `DB_${key.replace('certPath', 'SSL_CERT_PATH').toUpperCase()}`;
				throw new Error(`Missing environment variable in .env: ${envVarName}`);
			}
		}

		const absoluteCertPath = path.resolve(__dirname, '..', dbConfig.certPath!);

		connection = await mysql.createConnection({
			host: dbConfig.host,
			port: dbConfig.port,
			user: dbConfig.user,
			password: dbConfig.password,
			database: dbConfig.database,
			ssl: {
				ca: await fs.readFile(absoluteCertPath),
			},
			multipleStatements: true, // Allow multiple statements for cleanup
		});

		console.log('[SEED] Successfully connected to the database for seeding.');

		// Clear existing data from dependent tables first
		console.log('[SEED] Deleting existing inventory items and products...');
		await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
		await connection.query('TRUNCATE TABLE inventory_items;');
		await connection.query('TRUNCATE TABLE products;');
		await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
		console.log('[SEED] Existing data deleted.');

		const jsonPath = path.join(__dirname, 'filler.json');
		console.log(`[SEED] Reading JSON data from: ${jsonPath}`);
		const jsonData = await fs.readFile(jsonPath, 'utf-8');
		const products: Omit<Product, 'id'>[] = JSON.parse(jsonData);

		if (products.length === 0) {
			console.log('[SEED] No products found in JSON file. Exiting script.');
			return;
		}

		console.log(`[SEED] Found ${products.length} products to insert.`);

		// Insert products and create corresponding inventory items
		for (const product of products) {
			const productQuery = 'INSERT INTO products (name, description, category, product_type, price_per_month, image_url) VALUES (?, ?, ?, ?, ?, ?)';
			const [productResult] = await connection.execute(productQuery, [
				product.name,
				product.description,
				product.category,
				product.product_type,
				product.price_per_month,
				product.image_url,
			]);

			const productId = (productResult as mysql.ResultSetHeader).insertId;
			console.log(`[SEED] Inserted product '${product.name}' with ID: ${productId}`);

			// Create a corresponding inventory item for the new product
			const serialNumber = `SN-${productId}-${Date.now()}`;
			const inventoryQuery = 'INSERT INTO inventory_items (product_id, serial_number, status) VALUES (?, ?, ?)';
			await connection.execute(inventoryQuery, [productId, serialNumber, 'available']);
			console.log(`[SEED] Created inventory item for product ID: ${productId}`);
		}

		console.log(`[SEED] Successfully inserted all products and their inventory items!`);

	} catch (error) {
		console.error('[SEED] Error during the seeding process:', error);
		process.exit(1);
	} finally {
		if (connection) {
			await connection.end();
			console.log('[SEED] Database connection closed.');
		}
	}
}

seedDatabase();
