"use client";

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import type { Product } from "@/lib/types";
import { useState, useEffect } from "react";

type ReportDownloaderProps<T> = {
  data: T[];
  headers: Record<string, string>;
  filename: string;
  title: string;
  buttonText?: string;
  products?: Product[];
};

export default function ReportDownloader<T extends object>({
  data,
  headers,
  filename,
  title,
  buttonText = "Baixar Relatório",
  products,
}: ReportDownloaderProps<T>) {

  const [generatedDate, setGeneratedDate] = useState("");

  useEffect(() => {
    setGeneratedDate(new Date().toLocaleDateString("pt-BR"));
  }, []);


  const generateDoc = () => {
    if (!data || data.length === 0) {
      alert("Não há dados para gerar o relatório.");
      return;
    }

    const headerKeys = Object.keys(headers);

    const children: Paragraph[] = [
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({
        text: `Relatório gerado em: ${generatedDate}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
    ];

    data.forEach((row, index) => {
      if (index > 0) {
        children.push(new Paragraph({
          text: "____________________",
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 200 },
        }));
      }

      headerKeys.forEach((key) => {
        const label = headers[key as string];
        const cellValue = row[key as keyof T];

        if (key === 'items' && Array.isArray(cellValue)) {
            children.push(new Paragraph({
                children: [new TextRun({ text: `${label}:`, bold: true })],
                spacing: { before: 100 }
            }));
            
            cellValue.forEach((item: any) => {
                let text = '';
                if (item.productId && products) {
                    const product = products.find(p => p.id === item.productId);
                    text = `${item.quantity}x ${product?.name || 'Produto desconhecido'} - ${item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
                } else if (item.productName) { // Invoice Item
                    text = `${item.quantity}x ${item.productName} - ${item.cost.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
                } else {
                    text = JSON.stringify(item);
                }
                children.push(new Paragraph({ text, bullet: { level: 0 } }));
            });

        } else {
            let cellText: string;
            if (typeof cellValue === 'number' && (label.toLowerCase().includes('preço') || label.toLowerCase().includes('total'))) {
                cellText = cellValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            } else if (key === 'date' && typeof cellValue === 'string') {
                cellText = new Date(cellValue).toLocaleDateString("pt-BR", { timeZone: 'UTC' });
            } else {
                cellText = String(cellValue);
            }
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: `${label}: `, bold: true }),
                    new TextRun(cellText)
                ]
            }));
        }
      });
    });

    const doc = new Document({
      sections: [{ children }],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, filename);
    });
  };

  return (
    <Button variant="outline" onClick={generateDoc}>
      <FileText className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
}
