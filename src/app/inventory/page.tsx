import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import InventoryTable from "@/components/inventory/inventory-table";
import { getProducts } from "@/lib/data";

export default async function InventoryPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Inventário" 
        actions={
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Button>
        }
      />
      <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <InventoryTable products={products} />
      </main>
    </div>
  );
}
