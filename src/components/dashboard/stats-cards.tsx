import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, ShoppingBag } from "lucide-react";

type StatsCardsProps = {
  stats: {
    totalRevenue: number;
    salesThisMonth: number;
    totalProducts: number;
  };
};

export default function StatsCards({ stats }: StatsCardsProps) {
  const { totalRevenue, salesThisMonth, totalProducts } = stats;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </div>
          <p className="text-xs text-muted-foreground">Faturamento de todas as vendas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vendas (Mês)</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {salesThisMonth.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </div>
          <p className="text-xs text-muted-foreground">Faturamento de vendas neste mês</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{totalProducts}</div>
          <p className="text-xs text-muted-foreground">Total de produtos cadastrados</p>
        </CardContent>
      </Card>
    </div>
  );
}
