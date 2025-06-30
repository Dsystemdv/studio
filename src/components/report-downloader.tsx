"use client";

import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, HeadingLevel, AlignmentType, WidthType } from "docx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

type ReportDownloaderProps<T> = {
  data: T[];
  headers: Record<string, string>;
  filename: string;
  title: string;
  buttonText?: string;
};

export default function ReportDownloader<T extends object>({
  data,
  headers,
  filename,
  title,
  buttonText = "Baixar Relatório",
}: ReportDownloaderProps<T>) {

  const generateDoc = () => {
    if (!data || data.length === 0) {
      alert("Não há dados para gerar o relatório.");
      return;
    }

    const headerKeys = Object.keys(headers);

    const tableHeader = new TableRow({
      children: headerKeys.map(key => 
        new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: headers[key], bold: true })],
            alignment: AlignmentType.CENTER,
          })],
        })
      ),
      tableHeader: true,
    });
    
    const dataRows = data.map(row => {
      return new TableRow({
        children: (headerKeys as (keyof T)[]).map(key => {
          let cellValue = row[key];
          let cellText: string;

          if (typeof cellValue === 'number' && (headers[key as string].toLowerCase().includes('preço') || headers[key as string].toLowerCase().includes('total'))) {
            cellText = cellValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
          } else if (key === 'date' && typeof cellValue === 'string') {
            cellText = new Date(cellValue).toLocaleDateString("pt-BR");
          } else if (typeof cellValue === 'object' && cellValue !== null) {
            cellText = JSON.stringify(cellValue);
          } else {
            cellText = String(cellValue);
          }
          
          return new TableCell({
            children: [new Paragraph(cellText)],
          });
        }),
      });
    });

    const table = new Table({
      rows: [tableHeader, ...dataRows],
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Relatório gerado em: ${new Date().toLocaleDateString("pt-BR")}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph(" "), // Spacer
          table,
        ],
      }],
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
