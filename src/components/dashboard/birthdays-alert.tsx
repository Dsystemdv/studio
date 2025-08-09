import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Client } from "@/lib/types";
import { Gift } from "lucide-react";

type BirthdaysAlertProps = {
  clients: Client[];
};

export default function BirthdaysAlert({ clients }: BirthdaysAlertProps) {
    
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const adjustedDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
    return adjustedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit'});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="text-primary" />
          <span>Aniversariantes do Mês</span>
        </CardTitle>
        <CardDescription>Clientes que celebram mais um ano de vida este mês.</CardDescription>
      </CardHeader>
      <CardContent>
        {clients.length > 0 ? (
          <ul className="space-y-3">
            {clients.map((client) => (
              <li key={client.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{client.name}</p>
                </div>
                <Badge variant="secondary">{formatDate(client.birthDate)}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum aniversariante este mês.</p>
        )}
      </CardContent>
    </Card>
  );
}
