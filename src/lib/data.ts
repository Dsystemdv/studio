import { promises as fs } from 'fs';
import path from 'path';
import type { Product, Sale, Invoice } from "@/lib/types";

// Path to the JSON file that will act as our database
const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

type DB = {
  products: Product[];
  sales: Sale[];
  invoices: Invoice[];
};

// Helper function to read the database file
async function readDB(): Promise<DB> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Could not read database file:", error);
    // Return an empty state if the file doesn't exist or is unreadable
    return { products: [], sales: [], invoices: [] };
  }
}

// Helper function to write to the database file
// This will be useful for adding, updating, or deleting data later.
async function writeDB(data: DB): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Could not write to database file:", error);
  }
}

// Re-implementing data fetching functions to use the JSON file
export const getProducts = async (): Promise<Product[]> => {
  const db = await readDB();
  return db.products;
};

export const getSales = async (): Promise<Sale[]> => {
  const db = await readDB();
  return db.sales;
};

export const getInvoices = async (): Promise<Invoice[]> => {
  const db = await readDB();
  return db.invoices;
};

export const getLowStockProducts = async (threshold = 10): Promise<Product[]> => {
    const allProducts = await getProducts();
    return allProducts.filter(p => p.stock < threshold);
}

export const getProductById = async (id: string): Promise<Product | undefined> => {
    const allProducts = await getProducts();
    return allProducts.find(p => p.id === id);
}
