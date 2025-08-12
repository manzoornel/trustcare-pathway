import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface LabResult {
  detail_description: string;
  actual_result: string | number;
  unitdesc: string;
  min_value: string;
  max_value: string;
}

interface RawReport {
  id: string;
  date: string;
  result: LabResult[];
  doctor?: string;
  pdfUrl?: string;
  visitId: any;
}

interface ReportComparisonDialogProps {
  // Can be an array of visit IDs or report objects containing visitId
  selectedReports: any[];
  reports: RawReport[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getPercentageChange = (latest: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((latest - previous) / Math.abs(previous)) * 100;
};

const isWithinRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// Parse date strings like "03-09-2024 12:00 AM" reliably (DD-MM-YYYY)
const parseDateString = (input: string): Date => {
  if (!input) return new Date(0);
  const parts = input.split(" ");
  const datePart = parts[0] ?? "01-01-1970";
  const timePart = parts[1] ?? "00:00";
  const ampmPart = (parts[2] ?? "").toUpperCase();

  const [dayStr, monthStr, yearStr] = datePart.split("-");
  const [hourStr, minuteStr] = timePart.split(":");

  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);
  let hour = Number(hourStr);
  const minute = Number(minuteStr);

  if (ampmPart === "PM" && hour < 12) hour += 12;
  if (ampmPart === "AM" && hour === 12) hour = 0;

  return new Date(year, month - 1, day, hour, minute);
};

const ReportComparisonDialog: React.FC<ReportComparisonDialogProps> = ({
  selectedReports,
  reports,
  open,
  onOpenChange,
}) => {
  const selectedVisitIds = (selectedReports || []).map((s: any) =>
    typeof s === "object" && s !== null ? s.visitId : s
  );

  const selectedData = (reports || [])
    .filter((report) => selectedVisitIds.includes(report.visitId))
    .sort(
      (a, b) =>
        parseDateString(a.date).getTime() - parseDateString(b.date).getTime()
    );

  const allParameters = new Set<string>();
  selectedData.forEach((report) =>
    report.result.forEach((r) => allParameters.add(r.detail_description))
  );
  const paramList = Array.from(allParameters);

  console.log(selectedData, allParameters, paramList, reports, selectedReports);
  // Dynamically load jsPDF + autotable from CDN and download PDF without opening a new page
  const ensureJsPDF = async (): Promise<any> => {
    const w = window as any;
    if (w.jspdf && (w.jspdf as any).jsPDF) return w.jspdf;
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(s);
      });
    await loadScript(
      "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js"
    );
    return (window as any).jspdf;
  };

  // Header image config and helpers
  const HEADER_IMAGE_PATH =
    "/lovable-uploads/d18bbc61-0f35-4480-9b29-cf9dd88e75d3.png";
  const resolveImageUrl = (pathOrUrl: string): string => {
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    try {
      return new URL(pathOrUrl, window.location.origin).toString();
    } catch {
      return pathOrUrl;
    }
  };
  const fetchImageAsDataUrl = async (url: string): Promise<string | null> => {
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject as any;
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const getDoctorName = (): string => {
    // Prefer consulting doctor from results if present
    for (let i = selectedData.length - 1; i >= 0; i -= 1) {
      const rpt = selectedData[i];
      const r0: any = rpt?.result?.[0];
      if (r0?.consulting_doctor_name) return r0.consulting_doctor_name;
      if ((rpt as any).doctor) return (rpt as any).doctor;
    }
    return "Doctor";
  };

  const getDoctorInitials = (name: string): string => {
    const parts = name.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
    const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "");
    return initials.join("") || "DR";
  };

  const downloadPDF = async () => {
    const { header, rows } = buildComparisonGrid();
    const { jsPDF } = await ensureJsPDF();

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const doctorName = getDoctorName();
    const initials = getDoctorInitials(doctorName);
    // Header visuals
    const leftMargin = 40;
    const topMargin = 36;
    const circleX = leftMargin + 30;
    const circleY = topMargin + 30;
    const circleR = 26;

    // Try to draw header image; fallback to initials avatar
    let imageDataUrl: string | null = await fetchImageAsDataUrl(
      resolveImageUrl(HEADER_IMAGE_PATH)
    );
    if (imageDataUrl) {
      try {
        doc.addImage(imageDataUrl, "PNG", leftMargin, topMargin, 60, 60);
      } catch {
        doc.setFillColor(66, 133, 244);
        doc.circle(circleX, circleY, circleR, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text(initials, circleX, circleY + 6, {
          align: "center",
          baseline: "middle",
        } as any);
      }
    } else {
      doc.setFillColor(66, 133, 244);
      doc.circle(circleX, circleY, circleR, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(initials, circleX, circleY + 6, {
        align: "center",
        baseline: "middle",
      } as any);
    }

    // Header text
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Dr Uncle`, leftMargin + 70, topMargin + 12);
    doc.setFontSize(12);
    doc.text("Lab Report Comparison", leftMargin + 70, topMargin + 32);
    doc.setTextColor(100);

    // Divider
    doc.setDrawColor(230);
    doc.line(
      leftMargin,
      topMargin + 64,
      doc.internal.pageSize.getWidth() - leftMargin,
      topMargin + 64
    );

    // Table using autoTable if available
    const startY = topMargin + 80;
    const anyDoc = doc as any;
    if (anyDoc.autoTable) {
      anyDoc.autoTable({
        head: [header],
        body: rows,
        startY,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [243, 244, 246], textColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        margin: { left: leftMargin, right: leftMargin },
      });
    } else {
      // Fallback: simple text rows
      let y = startY;
      doc.setFontSize(10);
      doc.text(header.join("  |  "), leftMargin, y);
      y += 16;
      rows.forEach((r) => {
        if (y > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          y = topMargin;
        }
        doc.text(r.join("  |  "), leftMargin, y);
        y += 14;
      });
    }

    doc.save("lab-report-comparison.pdf");
  };

  // PDF downloads only when the user clicks the Download button.
  const buildComparisonGrid = () => {
    const header = [
      "Parameter",
      ...selectedData.map((report) => report.date),
      "% Change",
    ];

    const rows = paramList.map((paramName) => {
      const values = selectedData.map((report) =>
        report.result.find((r) => r.detail_description === paramName)
      );

      const latest = values[values.length - 1];
      const previous = values[values.length - 2];
      const percentChange =
        latest && previous
          ? getPercentageChange(
              Number(latest.actual_result),
              Number(previous.actual_result)
            )
          : null;

      const cells = values.map((val) =>
        val ? `${val.actual_result} ${val.unitdesc ?? ""}`.trim() : "—"
      );

      const pctCell =
        percentChange !== null
          ? `${percentChange > 0 ? "+" : ""}${percentChange.toFixed(1)}%`
          : "—";

      return [paramName, ...cells, pctCell];
    });

    return { header, rows };
  };

  // Removed CSV/print HTML export in favor of direct PDF download
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Report Comparison</DialogTitle>
          <DialogDescription>
            Comparing {selectedData.length} reports by date
          </DialogDescription>
          <div className="mt-2 flex gap-2 justify-end">
            <Button
              variant="default"
              size="sm"
              onClick={downloadPDF}
              disabled={selectedData.length === 0 || paramList.length === 0}
            >
              <FileDown className="h-4 w-4 mr-2" /> Download PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh]">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Report Comparison</CardTitle>
              <CardDescription>
                From {selectedData[0]?.date} to{" "}
                {selectedData[selectedData.length - 1]?.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    {selectedData.map((report) => (
                      <TableHead key={report.id}>{report.date}</TableHead>
                    ))}
                    <TableHead>% Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paramList.map((paramName) => {
                    const values = selectedData.map((report) =>
                      report.result.find(
                        (r) => r.detail_description === paramName
                      )
                    );

                    const latest = values[values.length - 1];
                    const previous = values[values.length - 2];

                    const percentChange =
                      latest && previous
                        ? getPercentageChange(
                            Number(latest.actual_result),
                            Number(previous.actual_result)
                          )
                        : null;

                    return (
                      <TableRow key={paramName}>
                        <TableCell>{paramName}</TableCell>
                        {values.map((val, i) => {
                          if (!val) return <TableCell key={i}>—</TableCell>;

                          const result = Number(val.actual_result);
                          const min = Number(val.min_value);
                          const max = Number(val.max_value);
                          const normal = isWithinRange(result, min, max);

                          return (
                            <TableCell key={i}>
                              <div className="flex items-center">
                                <span
                                  className={
                                    normal
                                      ? "text-gray-900"
                                      : "text-red-600 font-semibold"
                                  }
                                >
                                  {result}
                                </span>
                                <span className="text-sm text-muted-foreground ml-1">
                                  {val.unitdesc}
                                </span>
                              </div>
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          {percentChange !== null ? (
                            <span
                              className={`${
                                percentChange > 0
                                  ? "text-green-600"
                                  : percentChange < 0
                                  ? "text-red-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {percentChange > 0 ? "+" : ""}
                              {percentChange.toFixed(1)}%
                            </span>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportComparisonDialog;
