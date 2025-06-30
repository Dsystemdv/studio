// NOTE: This file is now used to manage the SQLite database connection.

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs/promises';
import type { Database } from './types';

const DB_FILE = path.join(process.cwd(), 'local.db');

async function seedDatabase(db: Awaited<ReturnType<typeof open>>) {
    console.log("Seeding database from db.json...");
    try {
        const dbJsonPath = path.join(process.cwd(), 'src', 'lib', 'db.json');
        const fileContent = await fs.readFile(dbJsonPath, 'utf-8');
        const data: Database = JSON.parse(fileContent);

        // Create tables
        await db.exec(`
            CREATE TABLE products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                stock INTEGER NOT NULL,
                costPrice REAL NOT NULL,
                price REAL NOT NULL
            );

            CREATE TABLE sales (
                id TEXT PRIMARY KEY,
                date TEXT NOT NULL,
                items TEXT NOT NULL,
                total REAL NOT NULL
            );

            CREATE TABLE invoices (
                id TEXT PRIMARY KEY,
                date TEXT NOT NULL,
                supplier TEXT NOT NULL,
                items TEXT NOT NULL,
                total REAL NOT NULL
            );
        `);

        // Seed products
        const productStmt = await db.prepare('INSERT INTO products (id, name, category, stock, costPrice, price) VALUES (?, ?, ?, ?, ?, ?)');
        for (const product of data.products) {
            await productStmt.run(product.id, product.name, product.category, product.stock, product.costPrice, product.price);
        }
        await productStmt.finalize();

        // Seed sales (if any)
        if (data.sales && data.sales.length > 0) {
            const saleStmt = await db.prepare('INSERT INTO sales (id, date, items, total) VALUES (?, ?, ?, ?)');
            for (const sale of data.sales) {
                await saleStmt.run(sale.id, sale.date, JSON.stringify(sale.items), sale.total);
            }
            await saleStmt.finalize();
        }

        // Seed invoices (if any)
        if (data.invoices && data.invoices.length > 0) {
            const invoiceStmt = await db.prepare('INSERT INTO invoices (id, date, supplier, items, total) VALUES (?, ?, ?, ?, ?)');
            for (const invoice of data.invoices) {
                await invoiceStmt.run(invoice.id, invoice.date, invoice.supplier, JSON.stringify(invoice.items), invoice.total);
            }
            await invoiceStmt.finalize();
        }

        console.log("Database seeded successfully.");
    } catch (error) {
        console.error("Failed to seed database:", error);
        await fs.unlink(DB_FILE).catch(() => {});
        throw error;
    }
}


async function getDbConnection() {
    const dbFileExists = await fs.access(DB_FILE).then(() => true).catch(() => false);

    const db = await open({
        filename: DB_FILE,
        driver: sqlite3.Database
    });

    if (!dbFileExists) {
        await seedDatabase(db);
    }
    
    await db.exec('PRAGMA foreign_keys = ON;');

    return db;
}

let dbPromise: Promise<Awaited<ReturnType<typeof open>>> | null = null;
export function getDb() {
  if (!dbPromise) {
    dbPromise = getDbConnection();
  }
  return dbPromise;
}
