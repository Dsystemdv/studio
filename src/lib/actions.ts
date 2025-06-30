'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import type { Product, Sale, Invoice } from './types';

// Path to the JSON database file
const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

// --- Types for the database structure ---
interface Database {
  products: Product[];
  sales: Sale[];
  invoices: Invoice[];
}

// --- Helper functions to read/write the database ---
async function readDb(): Promise<Database> {
  const fileContent = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(fileContent);
}

async function writeDb(data: Database): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}


// NOTA: Estas ações agora leem e escrevem no arquivo db.json.

export async function deleteSale(saleId: string) {
  if (!saleId) {
    return { success: false, message: 'ID da venda inválido.' };
  }

  try {
    const db = await readDb();
    const updatedSales = db.sales.filter((sale) => sale.id !== saleId);
    await writeDb({ ...db, sales: updatedSales });
    
    revalidatePath('/sales');
    revalidatePath('/');
    return { success: true, message: 'Venda excluída com sucesso.' };
  } catch (error) {
    console.error('Falha ao excluir a venda:', error);
    return { success: false, message: 'Falha ao excluir a venda.' };
  }
}

export async function deleteInvoice(invoiceId: string) {
  if (!invoiceId) {
    return { success: false, message: 'ID da nota inválido.' };
  }

  try {
    const db = await readDb();
    const updatedInvoices = db.invoices.filter((invoice) => invoice.id !== invoiceId);
    await writeDb({ ...db, invoices: updatedInvoices });

    revalidatePath('/invoices');
    revalidatePath('/');
    return { success: true, message: 'Nota de entrada excluída com sucesso.' };
  } catch (error) {
    console.error('Falha ao excluir a nota de entrada:', error);
    return { success: false, message: 'Falha ao excluir a nota de entrada.' };
  }
}

export async function updateProduct(productData: Product) {
  if (!productData || !productData.id) {
    return { success: false, message: 'Dados do produto inválidos.' };
  }

  try {
    const db = await readDb();
    const productIndex = db.products.findIndex((p) => p.id === productData.id);
    if (productIndex === -1) {
        return { success: false, message: 'Produto não encontrado.' };
    }
    db.products[productIndex] = productData;
    await writeDb(db);

    revalidatePath('/inventory');
    revalidatePath('/');
    return { success: true, message: 'Produto atualizado com sucesso.' };
  } catch (error) {
    console.error('Falha ao editar o produto:', error);
    return { success: false, message: 'Falha ao editar o produto.' };
  }
}


export async function deleteProduct(productId: string) {
  if (!productId) {
    return { success: false, message: 'ID do produto inválido.' };
  }

  try {
    const db = await readDb();
    const updatedProducts = db.products.filter((product) => product.id !== productId);
    await writeDb({ ...db, products: updatedProducts });
    
    revalidatePath('/inventory');
    revalidatePath('/');
    return { success: true, message: 'Produto excluído com sucesso.' };
  } catch (error) {
    console.error('Falha ao excluir o produto:', error);
    return { success: false, message: 'Falha ao excluir o produto.' };
  }
}
