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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { Sale, Product } from "@/lib/types";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { deleteSale } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export default function SalesTable({ sales, products }: { sales: Sale[], products: Product[] }) {
  const { toast } = useToast();

  const getProductDetails = (sale: Sale) => {
    if (sale.items.length === 1) {
        const product = products.find(p => p.id === sale.items[0].productId);
        return `${sale.items[0].quantity}x ${product?.name || 'Produto desconhecido'}`;
    }
    return `${sale.items.length} itens`;
  }

  const handleDelete = async (saleId: string) => {
    const result = await deleteSale(saleId);
    if (result.success) {
      toast({
        title: "Sucesso!",
        description: result.message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: result.message,
      });
    }
  };
  
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
              new TextRun(new Date(sale.date).toLocaleDateString("pt-BR", { timeZone: 'UTC' })),
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
                <TableCell>{new Date(sale.date).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</TableCell>
                <TableCell>{getProductDetails(sale)}</TableCell>
                <TableCell className="text-right">
                  {sale.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>
                    <AlertDialog>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Excluir</DropdownMenuItem>
                            </AlertDialogTrigger>
                            <DropdownMenuItem onClick={() => generateReceipt(sale)}>Gerar Recibo</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá permanentemente a venda.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(sale.id)}>Confirmar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
