"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { Sale, Product } from "@/lib/types";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

export default function SalesTable({ sales, products }: { sales: Sale[], products: Product[] }) {
  const getProductDetails = (sale: Sale) => {
    if (sale.items.length === 1) {
        const product = products.find(p => p.id === sale.items[0].productId);
        return `${sale.items[0].quantity}x ${product?.name || 'Produto desconhecido'}`;
    }
    return `${sale.items.length} itens`;
  }
  
  const generateReceipt = (sale: Sale) => {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: "Recibo de Venda",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "ID da Venda: ", bold: true }),
              new TextRun(sale.id.toUpperCase()),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Data: ", bold: true }),
              new TextRun(new Date(sale.date).toLocaleDateString("pt-BR")),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "Itens:",
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          ...sale.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            const itemText = `${item.quantity}x ${product?.name || 'Produto desconhecido'} - ${item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} cada`;
            return new Paragraph({
              text: itemText,
              bullet: { level: 0 },
            });
          }),
          new Paragraph({
             spacing: { after: 400 },
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: "Total: ", bold: true, size: 28 }),
              new TextRun({
                text: sale.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                bold: true,
                size: 28,
              }),
            ],
          }),
        ],
      }],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `recibo_${sale.id}.docx`);
    });
  };

  return (
    <Card>
       <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
            <CardDescription>Visualize todas as vendas registradas.</CardDescription>
        </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID da Venda</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.id.toUpperCase()}</TableCell>
                <TableCell>{new Date(sale.date).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>{getProductDetails(sale)}</TableCell>
                <TableCell className="text-right">
                  {sale.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => generateReceipt(sale)}>Gerar Recibo</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
