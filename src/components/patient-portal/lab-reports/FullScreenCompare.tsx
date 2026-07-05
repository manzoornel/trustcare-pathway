import React, { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
} from "recharts";

/**
 * FullScreenCompare — a fast, mobile-first, full-screen lab comparison.
 *
 * Replaces the old multi-step EnhancedReportComparisonDialog flow:
 *  - Opens instantly (all computation client-side, no network calls)
 *  - One parameter visible at a time, switched by tapping chips (no scrolling
 *    a giant table sideways)
 *  - Big chart + "since last visit" change card + simple value list
 *
 * Drop-in: accepts the same props as the old dialog.
 */

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
  visitId: any;
}

interface Props {
  selectedReports: any[];
  reports: RawReport[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fmtDate = (d: string) => {
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });
};

export const FullScreenCompare: React.FC<Props> = ({
  selectedReports,
  reports,
  open,
  onOpenChange,
}) => {
  // If fewer than 2 selected, auto-use the latest 2 reports (quick compare).
  const compareReports = useMemo(() => {
    const base =
      selectedReports && selectedReports.length >= 2
        ? selectedReports
        : (reports || []).slice(0, 2);
    return [...base].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [selectedReports, reports]);

  // Build: parameter -> [{date, value, unit, min, max}] across the reports
  const parameters = useMemo(() => {
    const map = new Map<
      string,
      { unit: string; min: number | null; max: number | null; points: { date: string; value: number }[] }
    >();
    for (const rep of compareReports) {
      for (const r of rep.result || []) {
        const value = parseFloat(String(r.actual_result));
        if (isNaN(value)) continue;
        const key = r.detail_description?.trim();
        if (!key) continue;
        if (!map.has(key)) {
          map.set(key, {
            unit: r.unitdesc || "",
            min: r.min_value ? parseFloat(r.min_value) : null,
            max: r.max_value ? parseFloat(r.max_value) : null,
            points: [],
          });
        }
        map.get(key)!.points.push({ date: rep.date, value });
      }
    }
    // Keep only parameters present in 2+ reports (comparable), sorted by name
    return Array.from(map.entries())
      .filter(([, v]) => v.points.length >= 2)
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [compareReports]);

  const [activeParam, setActiveParam] = useState<string | null>(null);

  useEffect(() => {
    if (parameters.length > 0) {
      setActiveParam((prev) =>
        prev && parameters.some(([k]) => k === prev) ? prev : parameters[0][0]
      );
    } else {
      setActiveParam(null);
    }
  }, [parameters]);

  const active = parameters.find(([k]) => k === activeParam);
  const info = active?.[1];
  const points = info?.points || [];
  const latest = points[points.length - 1];
  const previous = points[points.length - 2];
  const change = latest && previous ? latest.value - previous.value : 0;
  const pct =
    latest && previous && previous.value !== 0
      ? Math.round((change / previous.value) * 1000) / 10
      : 0;

  const inRange = (v: number) =>
    (info?.min == null || v >= info.min) && (info?.max == null || v <= info.max);

  const statusColor = latest
    ? inRange(latest.value)
      ? "text-green-600"
      : "text-red-600"
    : "text-gray-600";

  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-screen h-[100dvh] p-0 m-0 rounded-none flex flex-col gap-0 [&>button]:hidden">
        {/* Sticky header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
          <div>
            <DialogTitle className="text-base font-bold">Compare Reports</DialogTitle>
            <div className="text-xs text-muted-foreground">
              {compareReports.length} reports · {fmtDate(compareReports[0]?.date)} →{" "}
              {fmtDate(compareReports[compareReports.length - 1]?.date)}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {parameters.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground p-8 text-center">
            No common test values found across these reports.
            <br />
            Select reports that contain the same tests.
          </div>
        ) : (
          <>
            {/* Parameter chips — horizontal scroll, one tap to switch */}
            <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b bg-white flex-shrink-0 no-scrollbar">
              {parameters.map(([name]) => (
                <button
                  key={name}
                  onClick={() => setActiveParam(name)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                    name === activeParam
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Change since previous card */}
              {latest && previous && (
                <div className="rounded-2xl border p-4 flex items-center justify-between bg-white">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Change since {fmtDate(previous.date)}
                    </div>
                    <div className={`text-3xl font-extrabold ${statusColor}`}>
                      {latest.value}
                      <span className="text-sm font-semibold text-muted-foreground ml-1">
                        {info?.unit}
                      </span>
                    </div>
                    {info?.min != null && info?.max != null && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Normal: {info.min}–{info.max} {info.unit}
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex flex-col items-center gap-1 ${
                      change === 0
                        ? "text-gray-500"
                        : change > 0
                        ? "text-orange-600"
                        : "text-blue-600"
                    }`}
                  >
                    <TrendIcon className="h-7 w-7" />
                    <div className="text-sm font-bold">
                      {change > 0 ? "+" : ""}
                      {Math.round(change * 100) / 100}
                    </div>
                    <div className="text-xs">({pct > 0 ? "+" : ""}{pct}%)</div>
                  </div>
                </div>
              )}

              {/* Big chart with normal range band */}
              <div className="rounded-2xl border bg-white p-3">
                <div className="h-[38vh]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={points.map((p) => ({ ...p, label: fmtDate(p.date) }))}
                      margin={{ top: 10, right: 10, bottom: 0, left: -10 }}
                    >
                      {info?.min != null && info?.max != null && (
                        <ReferenceArea
                          y1={info.min}
                          y2={info.max}
                          fill="#22c55e"
                          fillOpacity={0.08}
                        />
                      )}
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} width={45} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0ea5e9"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#0ea5e9" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Simple value list — newest first */}
              <div className="rounded-2xl border bg-white divide-y">
                {[...points].reverse().map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-muted-foreground">{fmtDate(p.date)}</span>
                    <span
                      className={`text-sm font-bold ${
                        inRange(p.value) ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {p.value} {info?.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenCompare;
