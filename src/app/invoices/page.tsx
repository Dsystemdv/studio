import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import InvoicesTable from "@/components/invoices/invoices-table";
import { getInvoices } from "@/lib/data";

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  
  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Notas de Entrada" 
        actions={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Nota
          </Button>
        }
      />
      <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <InvoicesTable invoices={invoices} />
      </main>
    </div>
  );
}
