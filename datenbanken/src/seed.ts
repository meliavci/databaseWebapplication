import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { Item } from './models/item.models'; // Stelle sicher, dass der Pfad zu deinem Model korrekt ist

const envPath = path.resolve(__dirname,  '..', '.env');dotenv.config({ path: envPath });

console.log(`[SEED] Lade .env-Datei von: ${envPath}`);

async function seedDatabase() {
	let connection;
	try {
		// Schritt 2: Validiere die Umgebungsvariablen und baue Pfade.
		const dbConfig = {
			host: process.env['DB_HOST'],
			port: parseInt(process.env['DB_PORT'] || '3306'),
			user: process.env['DB_USER'],
			password: process.env['DB_PASSWORD'],
			database: process.env['DB_DATABASE'],
			certPath: process.env['DB_SSL_CERT_PATH'],
		};

		// Überprüfe, ob alle notwendigen Konfigurationen vorhanden sind.
		for (const [key, value] of Object.entries(dbConfig)) {
			if (!value) {
				throw new Error(`Fehlende Umgebungsvariable in .env: ${key.replace('certPath', 'DB_SSL_CERT_PATH').toUpperCase()}`);
			}
		}

		// Wandle den relativen Zertifikatspfad aus der .env in einen absoluten Pfad um.
		const absoluteCertPath = path.resolve(path.dirname(envPath), dbConfig.certPath!);

		// Schritt 3: Stelle die Datenbankverbindung her.
		connection = await mysql.createConnection({
			host: dbConfig.host,
			port: dbConfig.port,
			user: dbConfig.user,
			password: dbConfig.password,
			database: dbConfig.database,
			ssl: {
				ca: await fs.readFile(absoluteCertPath),
			},
		});

		console.log('[SEED] Erfolgreich mit der Datenbank für das Seeding verbunden.');

		// Schritt 4: Lese die Seed-Daten aus der JSON-Datei.
		const jsonPath = path.join(__dirname, '..', 'src', 'filler.json');
		console.log(`[SEED] Lese JSON-Daten von: ${jsonPath}`);
		const jsonData = await fs.readFile(jsonPath, 'utf-8');
		const items: Omit<Item, 'id'>[] = JSON.parse(jsonData);

		if (items.length === 0) {
			console.log('[SEED] Keine Items in der JSON-Datei gefunden. Beende das Skript.');
			return;
		}

		console.log(`[SEED] ${items.length} Items zum Einfügen gefunden.`);

		// Schritt 5: Bereite die Daten für einen effizienten Batch-Insert vor.
		// mysql2 erwartet ein Array von Arrays für diese Art von Query.
		const values = items.map(item => [
			item.category,
			item.description,
			item.status,
			item.price,
			item.source,
		]);

		// Schritt 6: Führe den Batch-Insert-Query aus.
		// Das '?' wird durch das gesamte `values`-Array ersetzt.
		const query = 'INSERT INTO items (category, description, status, price, source) VALUES ?';
		const [result] = await connection.query(query, [values]);

		console.log(`[SEED] Erfolgreich ${ (result as any).affectedRows } Items in die Datenbank eingefügt!`);

	} catch (error) {
		console.error('[SEED] Fehler während des Seeding-Prozesses:', error);
		// Beende das Skript mit einem Fehlercode, um z.B. CI/CD-Pipelines zu stoppen.
		process.exit(1);
	} finally {
		// Schritt 7: Schließe die Datenbankverbindung in jedem Fall.
		if (connection) {
			await connection.end();
			console.log('[SEED] Datenbankverbindung geschlossen.');
		}
	}
}

// Führe die Hauptfunktion aus.
seedDatabase();
