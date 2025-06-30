import fs from 'fs/promises';
import path from 'path';
import type { Product, Sale, Invoice } from '@/lib/types';

// Path to the JSON database file
const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

// --- Types for the database structure ---
interface Database {
  products: Product[];
  sales: Sale[];
  invoices: Invoice[];
}

// --- Helper function to read the database ---
async function readDb(): Promise<Database> {
  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return { products: [], sales: [], invoices: [] };
  }
}

// NOTA: Estas funções agora leem do arquivo db.json.

export const getProducts = async (): Promise<Product[]> => {
  console.log("Buscando produtos do db.json...");
  const db = await readDb();
  return db.products;
};

export const getSales = async (): Promise<Sale[]> => {
    console.log("Buscando vendas do db.json...");
    const db = await readDb();
    return db.sales;
};

export const getInvoices = async (): Promise<Invoice[]> => {
    console.log("Buscando notas de entrada do db.json...");
    const db = await readDb();
    return db.invoices;
};

export const getLowStockProducts = async (
  threshold = 10
): Promise<Product[]> => {
    console.log("Buscando produtos com baixo estoque do db.json...");
    const db = await readDb();
    return db.products.filter(p => p.stock < threshold);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    console.log(`Buscando produto com ID ${id} do db.json...`);
    const db = await readDb();
    return db.products.find(p => p.id === id);
};
