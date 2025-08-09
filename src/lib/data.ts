import { getDb } from './firebase';
import type { Product, Sale, Invoice, Client } from '@/lib/types';

// The 'db' is now a singleton promise from the repurposed firebase.ts file
const db = getDb();

export const getProducts = async (): Promise<Product[]> => {
  console.log("Buscando produtos do SQLite...");
  const conn = await db;
  return await conn.all('SELECT * FROM products ORDER BY name');
};

export const getSales = async (): Promise<Sale[]> => {
    console.log("Buscando vendas do SQLite...");
    const conn = await db;
    const sales = await conn.all('SELECT * FROM sales ORDER BY date DESC');
    return sales.map(sale => ({
      ...sale,
      items: JSON.parse(sale.items)
    }));
};

export const getInvoices = async (): Promise<Invoice[]> => {
    console.log("Buscando notas de entrada do SQLite...");
    const conn = await db;
    const invoices = await conn.all('SELECT * FROM invoices ORDER BY date DESC');
    return invoices.map(invoice => ({
        ...invoice,
        items: JSON.parse(invoice.items)
    }));
};

export const getClients = async (): Promise<Client[]> => {
    console.log("Buscando clientes do SQLite...");
    const conn = await db;
    return await conn.all('SELECT * FROM clients ORDER BY name');
};

export const getLowStockProducts = async (
  threshold = 10
): Promise<Product[]> => {
    console.log("Buscando produtos com baixo estoque do SQLite...");
    const conn = await db;
    return await conn.all('SELECT * FROM products WHERE stock < ? ORDER BY stock ASC', threshold);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    console.log(`Buscando produto com ID ${id} do SQLite...`);
    const conn = await db;
    return await conn.get('SELECT * FROM products WHERE id = ?', id);
};

export const getClientById = async (id: string): Promise<Client | undefined> => {
    console.log(`Buscando cliente com ID ${id} do SQLite...`);
    const conn = await db;
    return await conn.get('SELECT * FROM clients WHERE id = ?', id);
};
