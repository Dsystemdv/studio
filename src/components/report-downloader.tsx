"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type ReportDownloaderProps<T> = {
  data: T[];
  headers: Record<string, string>;
  filename: string;
  buttonText?: string;
};

export default function ReportDownloader<T extends object>({
  data,
  headers,
  filename,
  buttonText = "Baixar Relatório",
}: ReportDownloaderProps<T>) {

  const convertToCSV = (data: T[]) => {
    const headerRow = Object.values(headers).join(",") + "\n";
    const dataRows = data.map(row => {
      return (Object.keys(headers) as (keyof T)[]).map(key => {
        let cell = row[key];
        
        if (typeof cell === 'object' && cell !== null) {
          cell = JSON.stringify(cell) as T[keyof T];
        }

        const stringCell = String(cell);
        
        if (stringCell.includes(",")) {
          return `"${stringCell.replace(/"/g, '""')}"`;
        }
        return stringCell;
      }).join(",");
    }).join("\n");

    return headerRow + dataRows;
  };

  const handleDownload = () => {
    if (!data || data.length === 0) {
      alert("Não há dados para gerar o relatório.");
      return;
    }
    const csvContent = convertToCSV(data);
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
}
