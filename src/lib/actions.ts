'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from './firebase';
import type { Invoice, Product, Sale, Client } from './types';
import { randomUUID } from 'crypto';

// The 'db' is now a singleton promise from the repurposed firebase.ts file
const db = getDb();

export async function addProduct(productData: Omit<Product, 'id'>) {
  try {
    const conn = await db;
    const newId = randomUUID();
    await conn.run(
      'INSERT INTO products (id, name, category, stock, costPrice, price) VALUES (?, ?, ?, ?, ?, ?)',
      newId,
      productData.name,
      productData.category,
      productData.stock,
      productData.costPrice,
      productData.price
    );
    revalidatePath('/inventory');
    revalidatePath('/');
    return { success: true, message: 'Produto adicionado com sucesso.' };
  } catch (error) {
    console.error('Falha ao adicionar o produto:', error);
    return { success: false, message: 'Falha ao adicionar o produto.' };
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

export async function addSale(saleData: { items: { productId: string; quantity: number; price: number }[] }) {
  if (!saleData.items || saleData.items.length === 0) {
    return { success: false, message: 'A venda deve conter pelo menos um item.' };
  }
  
  try {
    const conn = await db;
    await conn.run('BEGIN TRANSACTION');

    const total = saleData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const newId = randomUUID();
    
    await conn.run(
      'INSERT INTO sales (id, date, items, total) VALUES (?, ?, ?, ?)',
      newId,
      new Date().toISOString(),
      JSON.stringify(saleData.items),
      total
    );

    for (const item of saleData.items) {
      await conn.run(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        item.quantity,
        item.productId
      );
    }
    
    await conn.run('COMMIT');

    revalidatePath('/sales');
    revalidatePath('/inventory');
    revalidatePath('/');
    return { success: true, message: 'Venda registrada com sucesso.' };
  } catch (error) {
    const conn = await db;
    await conn.run('ROLLBACK');
    console.error('Falha ao registrar a venda:', error);
    return { success: false, message: 'Falha ao registrar a venda.' };
  }
}

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

export async function addInvoice(invoiceData: Omit<Invoice, 'id' | 'total'>) {
   if (!invoiceData.items || invoiceData.items.length === 0) {
    return { success: false, message: 'A nota deve conter pelo menos um item.' };
  }

  try {
    const conn = await db;
    await conn.run('BEGIN TRANSACTION');

    const total = invoiceData.items.reduce((acc, item) => acc + item.cost * item.quantity, 0);
    const newId = randomUUID();

    await conn.run(
      'INSERT INTO invoices (id, date, supplier, items, total) VALUES (?, ?, ?, ?, ?)',
      newId,
      invoiceData.date,
      invoiceData.supplier,
      JSON.stringify(invoiceData.items),
      total
    );
    
    for (const item of invoiceData.items) {
        const product = await conn.get('SELECT id FROM products WHERE name = ? COLLATE NOCASE', item.productName);
        if (product) {
            await conn.run(
                'UPDATE products SET stock = stock + ? WHERE id = ?',
                item.quantity,
                product.id
            );
        } else {
            console.warn(`Produto "${item.productName}" não encontrado no inventário. Estoque não atualizado.`);
        }
    }

    await conn.run('COMMIT');

    revalidatePath('/invoices');
    revalidatePath('/inventory');
    revalidatePath('/');
    return { success: true, message: 'Nota de entrada adicionada com sucesso.' };
  } catch (error) {
    const conn = await db;
    await conn.run('ROLLBACK');
    console.error('Falha ao adicionar a nota de entrada:', error);
    return { success: false, message: 'Falha ao adicionar a nota de entrada.' };
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

export async function addClient(clientData: Omit<Client, 'id'>) {
  try {
    const conn = await db;
    const newId = randomUUID();
    await conn.run(
      'INSERT INTO clients (id, name, cpf, address, birthDate) VALUES (?, ?, ?, ?, ?)',
      newId,
      clientData.name,
      clientData.cpf,
      clientData.address,
      clientData.birthDate
    );
    revalidatePath('/clients');
    return { success: true, message: 'Cliente adicionado com sucesso.' };
  } catch (error) {
    console.error('Falha ao adicionar o cliente:', error);
    return { success: false, message: 'Falha ao adicionar o cliente.' };
  }
}

export async function updateClient(clientData: Client) {
  if (!clientData || !clientData.id) {
    return { success: false, message: 'Dados do cliente inválidos.' };
  }

  try {
    const conn = await db;
    const result = await conn.run(
      'UPDATE clients SET name = ?, cpf = ?, address = ?, birthDate = ? WHERE id = ?',
      clientData.name,
      clientData.cpf,
      clientData.address,
      clientData.birthDate,
      clientData.id
    );

    if (result.changes === 0) {
      return { success: false, message: 'Cliente não encontrado.' };
    }

    revalidatePath('/clients');
    return { success: true, message: 'Cliente atualizado com sucesso.' };
  } catch (error) {
    console.error('Falha ao editar o cliente:', error);
    return { success: false, message: 'Falha ao editar o cliente.' };
  }
}

export async function deleteClient(clientId: string) {
  if (!clientId) {
    return { success: false, message: 'ID do cliente inválido.' };
  }

  try {
    const conn = await db;
    const result = await conn.run('DELETE FROM clients WHERE id = ?', clientId);

    if (result.changes === 0) {
      return { success: false, message: 'Cliente não encontrado.' };
    }

    revalidatePath('/clients');
    return { success: true, message: 'Cliente excluído com sucesso.' };
  } catch (error) {
    console.error('Falha ao excluir o cliente:', error);
    return { success: false, message: 'Falha ao excluir o cliente.' };
  }
}
