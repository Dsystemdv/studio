import PageHeader from "@/components/page-header";
import InvoicesTable from "@/components/invoices/invoices-table";
import { getInvoices } from "@/lib/data";
import ReportDownloader from "@/components/report-downloader";
import type { Invoice } from "@/lib/types";
import AddInvoiceDialog from "@/components/invoices/add-invoice-dialog";

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  const invoiceHeaders: Record<keyof Invoice, string> = {
    id: "ID Nota",
    date: "Data",
    supplier: "Fornecedor",
    items: "Itens",
    total: "Total (R$)"
  };
  
  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Notas de Entrada" 
        actions={
          <div className="flex items-center gap-2">
            <ReportDownloader 
              title="Relatório de Notas de Entrada"
              data={invoices} 
              headers={invoiceHeaders} 
              filename="relatorio_notas_entrada.docx"
            />
            <AddInvoiceDialog />
          </div>
        }
      />
      <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <InvoicesTable invoices={invoices} />
      </main>
    </div>
  );
}
