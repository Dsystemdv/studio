import PageHeader from "@/components/page-header";
import StatsCards from "@/components/dashboard/stats-cards";
import SalesChart from "@/components/dashboard/sales-chart";
import LowStockAlert from "@/components/dashboard/low-stock-alert";
import { getLowStockProducts, getSales, getProducts } from "@/lib/data";

export default async function Dashboard() {
  const products = await getProducts();
  const sales = await getSales();

  const stats = {
    totalRevenue: sales.reduce((acc, sale) => acc + sale.total, 0),
    salesThisMonth: sales
      .filter((sale) => {
        const saleDate = new Date(sale.date);
        const today = new Date();
        return (
          saleDate.getMonth() === today.getMonth() &&
          saleDate.getFullYear() === today.getFullYear()
        );
      })
      .reduce((acc, sale) => acc + sale.total, 0),
    totalProducts: products.length,
    totalStockValue: products.reduce((acc, p) => acc + (p.costPrice * p.stock), 0),
  };

  const lowStockProducts = await getLowStockProducts();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Dashboard" />
      <main className="grid flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <StatsCards stats={stats} />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SalesChart salesData={sales} />
          </div>
          <div className="space-y-4">
            <LowStockAlert products={lowStockProducts} />
          </div>
        </div>
      </main>
    </div>
  );
}
