import React, { useEffect, useMemo, useState } from "react";
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

export const ReportComparisonDialog: React.FC<ReportComparisonDialogProps> = ({
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

  const allParameters = useMemo(() => {
    const set = new Set<string>();
    selectedData.forEach((report) =>
      report.result.forEach((r) => set.add(r.detail_description))
    );
    return Array.from(set);
  }, [selectedData]);

  // Filter parameters that have valid values
  const validParameters = useMemo(() => {
    return allParameters.filter((paramName) => {
      const hasValidValues = selectedData.some((report) => {
        const result = report.result.find(
          (r) => r.detail_description === paramName
        );
        return (
          result &&
          result.actual_result !== "-" &&
          !isNaN(Number(result.actual_result))
        );
      });
      return hasValidValues;
    });
  }, [allParameters, selectedData]);

  // Single-parameter selection (one-by-one)
  const [selectedParam, setSelectedParam] = useState<string | null>(null);
  useEffect(() => {
    if (validParameters.length > 0) {
      // Default to the first parameter to force one-by-one view
      setSelectedParam((prev) => prev ?? validParameters[0]);
    } else {
      setSelectedParam(null);
    }
  }, [validParameters]);

  const displayParams = useMemo(
    () => (selectedParam ? [selectedParam] : []),
    [selectedParam]
  );

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

  const buildComparisonGrid = () => {
    const header = ["Date", "Value"];

    const rows = displayParams
      .map((paramName) => {
        const values = selectedData
          .map((report) => ({
            date: report.date,
            value: report.result.find(
              (r) => r.detail_description === paramName
            ),
          }))
          .filter(
            (item) =>
              item.value &&
              item.value.actual_result !== "-" &&
              !isNaN(Number(item.value.actual_result))
          );

        return values.map((item) => [
          item.date,
          item.value.actual_result.toString(),
        ]);
      })
      .flat();

    return { header, rows };
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
    doc.text(
      `Lab Report Comparison - ${displayParams[0] ?? ""}`,
      leftMargin + 70,
      topMargin + 32
    );
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

    const safeParam = (displayParams[0] || "comparison").replace(
      /[^\w-]+/g,
      "_"
    );
    doc.save(`lab-report-${safeParam}.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Report Comparison</DialogTitle>
          <DialogDescription>
            Comparing {selectedData.length} reports by date
          </DialogDescription>

          <div className="mt-3 flex flex-col gap-4">
            {/* Parameter Selection Buttons */}
            <div className="flex flex-wrap gap-2">
              {validParameters.map((param) => (
                <Button
                  key={param}
                  variant={selectedParam === param ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedParam(param)}
                  className="text-sm"
                >
                  {param}
                </Button>
              ))}
            </div>

            {/* Download Button */}
            <div className="flex justify-end">
              <Button
                variant="default"
                size="sm"
                onClick={downloadPDF}
                disabled={
                  selectedData.length === 0 ||
                  (displayParams.length === 0 && allParameters.length === 0)
                }
              >
                <FileDown className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh]">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Report Comparison</CardTitle>
              <CardDescription>
                {displayParams[0]
                  ? `Parameter: ${displayParams[0]}`
                  : "Select a parameter to compare"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {displayParams.length > 0 ? (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-center mb-2">
                      {displayParams[0]}
                    </h3>
                    {(() => {
                      // Get the first valid result to extract normal range
                      const firstValidResult = selectedData
                        .map((report) => ({
                          date: report.date,
                          value: report.result.find(
                            (r) => r.detail_description === displayParams[0]
                          ),
                        }))
                        .filter(
                          (item) =>
                            item.value &&
                            item.value.actual_result !== "-" &&
                            !isNaN(Number(item.value.actual_result))
                        )[0];

                      if (
                        firstValidResult?.value?.min_value &&
                        firstValidResult?.value?.max_value
                      ) {
                        return (
                          <p className="text-sm text-gray-600 text-center">
                            Normal Range: {firstValidResult.value.min_value} -{" "}
                            {firstValidResult.value.max_value}
                          </p>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const values = selectedData
                          .map((report) => ({
                            date: report.date,
                            value: report.result.find(
                              (r) => r.detail_description === displayParams[0]
                            ),
                          }))
                          .filter(
                            (item) =>
                              item.value &&
                              item.value.actual_result !== "-" &&
                              !isNaN(Number(item.value.actual_result))
                          );

                        return values.map((item, index) => {
                          const result = Number(item.value.actual_result);
                          const min = Number(item.value.min_value);
                          const max = Number(item.value.max_value);
                          const normal = isWithinRange(result, min, max);

                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {item.date}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={
                                    normal
                                      ? "text-gray-900"
                                      : "text-red-600 font-semibold"
                                  }
                                >
                                  {result}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        });
                      })()}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a parameter to view comparison
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportComparisonDialog;
