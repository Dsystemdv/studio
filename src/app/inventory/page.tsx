import PageHeader from "@/components/page-header";
import InventoryTable from "@/components/inventory/inventory-table";
import { getProducts } from "@/lib/data";
import ReportDownloader from "@/components/report-downloader";
import type { Product } from "@/lib/types";
import AddProductDialog from "@/components/inventory/add-product-dialog";

export default async function InventoryPage() {
  const products = await getProducts();
  const productHeaders: Record<keyof Product, string> = {
      id: "ID",
      name: "Nome",
      category: "Categoria",
      stock: "Estoque",
      costPrice: "Preço de Custo (R$)",
      price: "Preço de Venda (R$)"
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Estoque" 
        actions={
          <div className="flex items-center gap-2">
            <ReportDownloader 
                title="Relatório de Estoque"
                data={products} 
                headers={productHeaders} 
                filename="relatorio_estoque.docx"
            />
            <AddProductDialog />
          </div>
        }
      />
      <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <InventoryTable products={products} />
      </main>
    </div>
  );
}
