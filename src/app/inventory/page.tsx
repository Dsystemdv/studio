import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import InventoryTable from "@/components/inventory/inventory-table";
import { getProducts } from "@/lib/data";
import ReportDownloader from "@/components/report-downloader";
import type { Product } from "@/lib/types";

export default async function InventoryPage() {
  const products = await getProducts();
  const productHeaders: Record<keyof Product, string> = {
      id: "ID",
      name: "Nome",
      category: "Categoria",
      stock: "Estoque",
      price: "Preço (R$)"
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Inventário" 
        actions={
          <div className="flex items-center gap-2">
            <ReportDownloader 
                title="Relatório de Inventário"
                data={products} 
                headers={productHeaders} 
                filename="relatorio_inventario.docx"
            />
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </div>
        }
      />
      <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <InventoryTable products={products} />
      </main>
    </div>
  );
}
