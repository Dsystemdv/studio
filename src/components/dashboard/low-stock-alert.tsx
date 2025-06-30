import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { AlertCircle } from "lucide-react";

type LowStockAlertProps = {
  products: Product[];
};

export default function LowStockAlert({ products }: LowStockAlertProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="text-destructive" />
          <span>Alerta de Estoque Baixo</span>
        </CardTitle>
        <CardDescription>Produtos que precisam de reposição em breve.</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <ul className="space-y-3">
            {products.map((product) => (
              <li key={product.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <Badge variant="destructive">{product.stock} em estoque</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum produto com estoque baixo.</p>
        )}
      </CardContent>
    </Card>
  );
}
