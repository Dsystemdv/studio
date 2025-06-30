'use server';

import { revalidatePath } from 'next/cache';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function deleteSale(saleId: string) {
  if (!saleId) {
    return { success: false, message: 'ID da venda inválido.' };
  }

  try {
    const saleRef = doc(db, 'sales', saleId);
    await deleteDoc(saleRef);

    revalidatePath('/sales');
    revalidatePath('/'); // Also revalidate dashboard
    return { success: true, message: 'Venda excluída com sucesso.' };
  } catch (error) {
    console.error('Failed to delete sale:', error);
    return { success: false, message: 'Falha ao excluir a venda.' };
  }
}
