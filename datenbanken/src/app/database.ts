import mysql, { Pool } from 'mysql2/promise';
import fs from 'fs';

// Lade Umgebungsvariablen
import dotenv from 'dotenv';
dotenv.config();

let pool: Pool;

try {
	// Lese das CA-Zertifikat für die SSL-Verbindung
	const caCert = fs.readFileSync(process.env['DB_SSL_CERT_PATH'] as string);

	// Erstelle den Connection Pool
	pool = mysql.createPool({
		host: process.env['DB_HOST'],
		port: parseInt(process.env['DB_PORT'] || '3306'),
		user: process.env['DB_USER'],
		password: process.env['DB_PASSWORD'],
		database: process.env['DB_DATABASE'],
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0,
		ssl: {
			rejectUnauthorized: true,
			ca: caCert,
		},
	});

	// Teste die Verbindung (optional, aber sehr empfohlen)
	pool.getConnection()
		.then(connection => {
			console.log('Erfolgreich mit der MySQL-Datenbank verbunden!');
			connection.release();
		})
		.catch(err => {
			console.error('Fehler beim Verbinden mit der MySQL-Datenbank:', err);
		});

} catch (error) {
	console.error('Konnte die Datenbankkonfiguration nicht laden oder Zertifikat nicht finden:', error);
	process.exit(1); // Beende die Anwendung, wenn die DB-Verbindung nicht initialisiert werden kann
}


// Exportiere den erstellten Pool, damit andere Teile der App ihn nutzen können
export default pool!;
