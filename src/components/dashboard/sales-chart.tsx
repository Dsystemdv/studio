"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Sale } from "@/lib/types";

type SalesChartProps = {
  salesData: Sale[];
};

export default function SalesChart({ salesData }: SalesChartProps) {
  const monthlySales = salesData.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(monthlySales)
    .map(month => ({ name: month, total: monthlySales[month] }))
    .reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral das Vendas</CardTitle>
        <CardDescription>Um resumo das vendas dos últimos meses.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent))', radius: 'var(--radius)' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderRadius: 'var(--radius)',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
