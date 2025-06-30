'use server';

import { revalidatePath } from 'next/cache';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, firebaseConfig } from './firebase';

export async function deleteSale(saleId: string) {
  const isFirebaseConfigured = firebaseConfig.projectId !== 'your-project-id';

  if (!isFirebaseConfigured) {
    return { success: false, message: 'A exclusão não é possível pois o Firebase não está configurado.' };
  }
  
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
    if (error instanceof Error && error.message.includes("PERMISSION_DENIED")) {
        return { success: false, message: 'Falha ao excluir: Permissão negada. Verifique as regras de segurança do seu banco de dados Firestore.' };
    }
    return { success: false, message: 'Falha ao excluir a venda.' };
  }
}

export async function deleteInvoice(invoiceId: string) {
  const isFirebaseConfigured = firebaseConfig.projectId !== 'your-project-id';

  if (!isFirebaseConfigured) {
    return { success: false, message: 'A exclusão não é possível pois o Firebase não está configurado.' };
  }
  
  if (!invoiceId) {
    return { success: false, message: 'ID da nota inválido.' };
  }

  try {
    const invoiceRef = doc(db, 'invoices', invoiceId);
    await deleteDoc(invoiceRef);

    revalidatePath('/invoices');
    revalidatePath('/'); // Also revalidate dashboard
    return { success: true, message: 'Nota de entrada excluída com sucesso.' };
  } catch (error) {
    console.error('Failed to delete invoice:', error);
    if (error instanceof Error && error.message.includes("PERMISSION_DENIED")) {
        return { success: false, message: 'Falha ao excluir: Permissão negada. Verifique as regras de segurança do seu banco de dados Firestore.' };
    }
    return { success: false, message: 'Falha ao excluir a nota de entrada.' };
  }
}
