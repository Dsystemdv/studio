'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from './firebase';
import type { Product } from './types';

// The 'db' is now a singleton promise from the repurposed firebase.ts file
const db = getDb();

export async function deleteSale(saleId: string) {
  if (!saleId) {
    return { success: false, message: 'ID da venda inválido.' };
  }

  try {
    const conn = await db;
    const result = await conn.run('DELETE FROM sales WHERE id = ?', saleId);
    
    if (result.changes === 0) {
      return { success: false, message: 'Venda não encontrada.' };
    }
    
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
    const conn = await db;
    const result = await conn.run('DELETE FROM invoices WHERE id = ?', invoiceId);
    
    if (result.changes === 0) {
      return { success: false, message: 'Nota de entrada não encontrada.' };
    }

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
    const conn = await db;
    const result = await conn.run(
        'UPDATE products SET name = ?, category = ?, stock = ?, costPrice = ?, price = ? WHERE id = ?',
        productData.name,
        productData.category,
        productData.stock,
        productData.costPrice,
        productData.price,
        productData.id
    );

    if (result.changes === 0) {
        return { success: false, message: 'Produto não encontrado.' };
    }

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
    const conn = await db;
    const result = await conn.run('DELETE FROM products WHERE id = ?', productId);
    
    if (result.changes === 0) {
      return { success: false, message: 'Produto não encontrado.' };
    }
    
    revalidatePath('/inventory');
    revalidatePath('/');
    return { success: true, message: 'Produto excluído com sucesso.' };
  } catch (error) {
    console.error('Falha ao excluir o produto:', error);
    return { success: false, message: 'Falha ao excluir o produto.' };
  }
}
