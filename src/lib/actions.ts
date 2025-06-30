'use server';

import { revalidatePath } from 'next/cache';
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
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { products: [], sales: [], invoices: [] };
    }
    console.error("Could not read database file:", error);
    return { products: [], sales: [], invoices: [] };
  }
}

// Helper function to write to the database file
async function writeDB(data: DB): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Could not write to database file:", error);
  }
}

export async function deleteSale(saleId: string) {
  try {
    const db = await readDB();
    const initialCount = db.sales.length;
    const updatedSales = db.sales.filter((sale) => sale.id !== saleId);

    if (updatedSales.length === initialCount) {
      return { success: false, message: 'Venda não encontrada.' };
    }

    await writeDB({ ...db, sales: updatedSales });
    revalidatePath('/sales');
    revalidatePath('/');
    return { success: true, message: 'Venda excluída com sucesso.' };
  } catch (error) {
    console.error('Failed to delete sale:', error);
    return { success: false, message: 'Falha ao excluir a venda.' };
  }
}
