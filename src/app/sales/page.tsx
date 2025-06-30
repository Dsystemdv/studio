import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import SalesTable from "@/components/sales/sales-table";
import { getSales, getProducts } from "@/lib/data";
import ReportDownloader from "@/components/report-downloader";
import type { Sale } from "@/lib/types";

export default async function SalesPage() {
  const sales = await getSales();
  const products = await getProducts();
  const saleHeaders: Record<keyof Sale, string> = {
      id: "ID Venda",
      date: "Data",
      items: "Itens",
      total: "Total (R$)"
  };
  
  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Vendas" 
        actions={
          <div className="flex items-center gap-2">
             <ReportDownloader 
                data={sales} 
                headers={saleHeaders} 
                filename="relatorio_vendas.csv"
            />
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Registrar Venda
            </Button>
          </div>
        }
      />
      <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <SalesTable sales={sales} products={products} />
      </main>
    </div>
  );
}
