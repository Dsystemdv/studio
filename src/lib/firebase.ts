// NOTE: This file is now used to manage the SQLite database connection.

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs/promises';
import type { Database } from './types';

const DB_FILE = path.join(process.cwd(), 'local.db');

async function tableExists(db: Awaited<ReturnType<typeof open>>, tableName: string): Promise<boolean> {
  const result = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name=?", tableName);
  return !!result;
}

async function tableIsEmpty(db: Awaited<ReturnType<typeof open>>, tableName: string): Promise<boolean> {
    const result = await db.get(`SELECT COUNT(*) as count FROM ${tableName}`);
    return result.count === 0;
}

async function seedDatabase(db: Awaited<ReturnType<typeof open>>) {
    console.log("Checking and seeding database from db.json if needed...");
    try {
        const dbJsonPath = path.join(process.cwd(), 'src', 'lib', 'db.json');
        const fileContent = await fs.readFile(dbJsonPath, 'utf-8');
        const data: Partial<Database> = JSON.parse(fileContent);

        // Check and create products table
        if (!await tableExists(db, 'products')) {
            console.log("Creating 'products' table...");
            await db.exec(`
                CREATE TABLE products (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    category TEXT NOT NULL,
                    stock INTEGER NOT NULL,
                    costPrice REAL NOT NULL,
                    price REAL NOT NULL
                );
            `);
        }
        
        if (await tableIsEmpty(db, 'products') && data.products) {
            console.log("Seeding 'products' table...");
            const productStmt = await db.prepare('INSERT INTO products (id, name, category, stock, costPrice, price) VALUES (?, ?, ?, ?, ?, ?)');
            for (const product of data.products) {
                await productStmt.run(product.id, product.name, product.category, product.stock, product.costPrice, product.price);
            }
            await productStmt.finalize();
            console.log("'products' table seeded.");
        }

        // Check and create sales table
        if (!await tableExists(db, 'sales')) {
            console.log("Creating 'sales' table...");
            await db.exec(`
                CREATE TABLE sales (
                    id TEXT PRIMARY KEY,
                    date TEXT NOT NULL,
                    items TEXT NOT NULL,
                    total REAL NOT NULL
                );
            `);
        }
        
        if (await tableIsEmpty(db, 'sales') && data.sales) {
            console.log("Seeding 'sales' table...");
            const saleStmt = await db.prepare('INSERT INTO sales (id, date, items, total) VALUES (?, ?, ?, ?)');
            for (const sale of data.sales) {
                await saleStmt.run(sale.id, sale.date, JSON.stringify(sale.items), sale.total);
            }
            await saleStmt.finalize();
            console.log("'sales' table seeded.");
        }
        

        // Check and create invoices table
        if (!await tableExists(db, 'invoices')) {
            console.log("Creating 'invoices' table...");
            await db.exec(`
                CREATE TABLE invoices (
                    id TEXT PRIMARY KEY,
                    date TEXT NOT NULL,
                    supplier TEXT NOT NULL,
                    items TEXT NOT NULL,
                    total REAL NOT NULL
                );
            `);
        }

        if (await tableIsEmpty(db, 'invoices') && data.invoices) {
            console.log("Seeding 'invoices' table...");
            const invoiceStmt = await db.prepare('INSERT INTO invoices (id, date, supplier, items, total) VALUES (?, ?, ?, ?, ?)');
            for (const invoice of data.invoices) {
                await invoiceStmt.run(invoice.id, invoice.date, invoice.supplier, JSON.stringify(invoice.items), invoice.total);
            }
            await invoiceStmt.finalize();
            console.log("'invoices' table seeded.");
        }

        // Check and create clients table
        if (!await tableExists(db, 'clients')) {
            console.log("Creating 'clients' table...");
            await db.exec(`
                CREATE TABLE clients (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    cpf TEXT NOT NULL,
                    address TEXT NOT NULL,
                    city TEXT NOT NULL,
                    birthDate TEXT NOT NULL
                );
            `);
        }
        
        if (await tableIsEmpty(db, 'clients') && data.clients) {
            console.log("Seeding 'clients' table...");
            const clientStmt = await db.prepare('INSERT INTO clients (id, name, cpf, address, city, birthDate) VALUES (?, ?, ?, ?, ?, ?)');
            for (const client of data.clients) {
                await clientStmt.run(client.id, client.name, client.cpf, client.address, client.city || "Não informado", client.birthDate);
            }
            await clientStmt.finalize();
            console.log("'clients' table seeded.");
        }


        console.log("Database verification and seeding complete.");
    } catch (error) {
        console.error("Failed during database setup:", error);
        throw error;
    }
}

async function initializeDatabase() {
    const db = await open({
        filename: DB_FILE,
        driver: sqlite3.Database
    });
    
    await db.exec('PRAGMA foreign_keys = ON;');
    await seedDatabase(db);
    
    return db;
}


let dbPromise: Promise<Awaited<ReturnType<typeof open>>> | null = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = initializeDatabase();
  }
  return dbPromise;
}
