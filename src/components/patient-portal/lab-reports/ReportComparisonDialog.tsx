import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileDown,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

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
  selectedReports: any[];
  reports: RawReport[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const isWithinRange = (value: number, min: number, max: number): boolean => {
  if (Number.isNaN(min) || Number.isNaN(max)) return true;
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

const formatShortDate = (input: string): string => {
  const d = parseDateString(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

type RowCell = {
  date: string;
  value: number | null;
  raw: string;
  isValid: boolean;
};

type ComparisonRow = {
  name: string;
  unit: string;
  min: number;
  max: number;
  cells: RowCell[];
  latestValue: number | null;
  latestIsAbnormal: boolean;
  trend: "up" | "down" | "same" | null;
  trendPct: number | null;
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

  // Oldest -> newest, so the table reads left-to-right like a timeline
  const selectedData = useMemo(
    () =>
      (reports || [])
        .filter((report) => selectedVisitIds.includes(report.visitId))
        .sort(
          (a, b) =>
            parseDateString(a.date).getTime() - parseDateString(b.date).getTime()
        ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reports, JSON.stringify(selectedVisitIds)]
  );

  const dates = useMemo(() => selectedData.map((r) => r.date), [selectedData]);

  const rows = useMemo<ComparisonRow[]>(() => {
    const order: string[] = [];
    const seen = new Set<string>();
    selectedData.forEach((report) => {
      report.result.forEach((r) => {
        if (!seen.has(r.detail_description)) {
          seen.add(r.detail_description);
          order.push(r.detail_description);
        }
      });
    });

    return order
      .map((paramName): ComparisonRow | null => {
        let unit = "";
        let min = NaN;
        let max = NaN;

        const cells: RowCell[] = selectedData.map((report) => {
          const found = report.result.find(
            (r) => r.detail_description === paramName
          );
          const numeric = found ? Number(found.actual_result) : NaN;
          const isValid =
            !!found && found.actual_result !== "-" && !Number.isNaN(numeric);
          if (isValid && found) {
            unit = found.unitdesc || unit;
            min = Number(found.min_value);
            max = Number(found.max_value);
          }
          return {
            date: report.date,
            value: isValid ? numeric : null,
            raw: found ? String(found.actual_result) : "-",
            isValid,
          };
        });

        const validCells = cells.filter((c) => c.isValid);
        if (validCells.length === 0) return null;

        const latest = validCells[validCells.length - 1];
        const previous =
          validCells.length > 1 ? validCells[validCells.length - 2] : null;

        let trend: ComparisonRow["trend"] = null;
        let trendPct: number | null = null;
        if (previous && latest.value !== null && previous.value !== null) {
          if (latest.value > previous.value) trend = "up";
          else if (latest.value < previous.value) trend = "down";
          else trend = "same";
          trendPct =
            previous.value === 0
              ? null
              : ((latest.value - previous.value) / Math.abs(previous.value)) * 100;
        }

        return {
          name: paramName,
          unit,
          min,
          max,
          cells,
          latestValue: latest.value,
          latestIsAbnormal:
            latest.value !== null ? !isWithinRange(latest.value, min, max) : false,
          trend,
          trendPct,
        };
      })
      .filter((r): r is ComparisonRow => r !== null);
  }, [selectedData]);

  const summary = useMemo(() => {
    const abnormal = rows.filter((r) => r.latestIsAbnormal).length;
    return { total: rows.length, abnormal, normal: rows.length - abnormal };
  }, [rows]);

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
    const { jsPDF } = await ensureJsPDF();

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const doctorName = getDoctorName();
    const initials = getDoctorInitials(doctorName);
    const leftMargin = 40;
    const topMargin = 36;
    const circleX = leftMargin + 30;
    const circleY = topMargin + 30;
    const circleR = 26;

    let imageDataUrl: string | null = await fetchImageAsDataUrl(
      resolveImageUrl(HEADER_IMAGE_PATH)
    );
    if (imageDataUrl) {
      try {
        doc.addImage(imageDataUrl, "PNG", leftMargin, topMargin, 60, 60);
      } catch {
        imageDataUrl = null;
      }
    }
    if (!imageDataUrl) {
      doc.setFillColor(37, 190, 203);
      doc.circle(circleX, circleY, circleR, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text(initials, circleX, circleY + 6, {
        align: "center",
        baseline: "middle",
      } as any);
    }

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Doctor Uncle Family Clinic`, leftMargin + 70, topMargin + 12);
    doc.setFontSize(12);
    doc.text(
      `Lab Report Comparison — ${dates.length} visits`,
      leftMargin + 70,
      topMargin + 32
    );
    doc.setTextColor(100);

    doc.setDrawColor(230);
    doc.line(
      leftMargin,
      topMargin + 64,
      doc.internal.pageSize.getWidth() - leftMargin,
      topMargin + 64
    );

    const startY = topMargin + 80;
    const anyDoc = doc as any;
    const head = ["Test", ...dates.map(formatShortDate)];
    const body = rows.map((row) => [
      row.unit ? `${row.name} (${row.unit})` : row.name,
      ...row.cells.map((c) => (c.isValid ? c.raw : "—")),
    ]);

    if (anyDoc.autoTable) {
      anyDoc.autoTable({
        head: [head],
        body,
        startY,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [243, 244, 246], textColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        margin: { left: leftMargin, right: leftMargin },
      });
    } else {
      let y = startY;
      doc.setFontSize(10);
      doc.text(head.join("  |  "), leftMargin, y);
      y += 16;
      body.forEach((r) => {
        if (y > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          y = topMargin;
        }
        doc.text(r.join("  |  "), leftMargin, y);
        y += 14;
      });
    }

    doc.save(`lab-report-comparison.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-2">
          <DialogTitle>Report Comparison</DialogTitle>
          <DialogDescription>
            റിപ്പോർട്ട് താരതമ്യം &middot; comparing {dates.length} visits, oldest to newest
          </DialogDescription>
        </DialogHeader>

        {rows.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center text-muted-foreground max-w-sm">
              <p className="font-medium mb-1">No matching tests found</p>
              <p className="text-sm">
                The visits you selected don't share any test with a valid result.
                Try picking two visits that both include a similar test panel.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary strip */}
            <div className="flex-shrink-0 px-6 pb-3 flex flex-wrap items-center gap-2 animate-fade-in">
              <Badge className="bg-cyan-50 text-cyan-700 border-transparent hover:bg-cyan-50">
                {summary.total} tests compared
              </Badge>
              {summary.normal > 0 && (
                <Badge className="bg-green-50 text-green-700 border-transparent hover:bg-green-50 gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {summary.normal} normal
                </Badge>
              )}
              {summary.abnormal > 0 && (
                <Badge className="bg-red-50 text-red-600 border-transparent hover:bg-red-50 gap-1 animate-pulse-soft">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {summary.abnormal} need a look
                </Badge>
              )}
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPDF}
                disabled={rows.length === 0}
              >
                <FileDown className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </div>

            {/* The horizontal inset lives on this non-scrolling wrapper, not
                on the overflow-auto element itself — padding on a scroll
                container's leading edge doesn't stay put once scrolled past,
                which is what let the sticky column show a gap before */}
            <div className="flex-1 min-h-0 px-6 pb-6 overflow-hidden">
              <div className="h-full overflow-auto">
              <table className="w-full border-separate border-spacing-0 text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 bg-background text-left font-semibold py-2 pr-3 border-b min-w-[160px]">
                      Test
                    </th>
                    {dates.map((d) => (
                      <th
                        key={d}
                        className="bg-background text-center font-semibold py-2 px-3 border-b whitespace-nowrap min-w-[100px]"
                      >
                        {formatShortDate(d)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.name}
                      className="animate-fade-up group hover:bg-neutral-50"
                      style={{ animationDelay: `${Math.min(i * 40, 480)}ms`, animationFillMode: "backwards" }}
                    >
                      <td className="sticky left-0 z-10 bg-background group-hover:bg-neutral-50 py-2.5 pr-3 align-top border-b transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">{row.name}</span>
                          {row.trend === "up" && (
                            <TrendingUp
                              className={`h-3.5 w-3.5 shrink-0 animate-scale-in ${
                                row.latestIsAbnormal ? "text-red-600" : "text-muted-foreground"
                              }`}
                            />
                          )}
                          {row.trend === "down" && (
                            <TrendingDown
                              className={`h-3.5 w-3.5 shrink-0 animate-scale-in ${
                                row.latestIsAbnormal ? "text-red-600" : "text-muted-foreground"
                              }`}
                            />
                          )}
                          {row.trend === "same" && (
                            <Minus className="h-3.5 w-3.5 shrink-0 text-muted-foreground animate-scale-in" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {row.unit || " "}
                          {Number.isFinite(row.min) && Number.isFinite(row.max)
                            ? ` · ${row.min}–${row.max}`
                            : ""}
                        </div>
                        {row.trendPct !== null && (
                          <div
                            className={`text-xs font-medium ${
                              row.trend === "up" ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {row.trend === "up" ? "+" : ""}
                            {row.trendPct.toFixed(1)}% since last
                          </div>
                        )}
                      </td>
                      {row.cells.map((cell, ci) => {
                        const isAbnormal =
                          cell.isValid && cell.value !== null
                            ? !isWithinRange(cell.value, row.min, row.max)
                            : false;
                        return (
                          <td
                            key={ci}
                            className="text-center py-2.5 px-3 align-top border-b"
                          >
                            {cell.isValid ? (
                              <span
                                className={
                                  isAbnormal
                                    ? "font-semibold text-red-600"
                                    : "text-foreground"
                                }
                              >
                                {cell.raw}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/50">
                                not tested
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportComparisonDialog;
