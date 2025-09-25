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
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FileDown, TrendingUp, TrendingDown, Minus, Search, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";

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

interface EnhancedReportComparisonProps {
  selectedReports: any[];
  reports: RawReport[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TrendInsight {
  parameter: string;
  trend: 'improving' | 'worsening' | 'stable';
  change: number;
  percentage: number;
  days: number;
  unit: string;
}

const getParameterCategory = (paramName: string): string => {
  const name = paramName.toLowerCase();
  
  if (name.includes('glucose') || name.includes('sugar') || name.includes('hba1c')) {
    return 'biochemistry';
  }
  if (name.includes('hemoglobin') || name.includes('wbc') || name.includes('rbc') || name.includes('platelet')) {
    return 'hematology';
  }
  if (name.includes('tsh') || name.includes('t3') || name.includes('t4') || name.includes('thyroid')) {
    return 'thyroid';
  }
  if (name.includes('cholesterol') || name.includes('ldl') || name.includes('hdl') || name.includes('triglyceride')) {
    return 'lipids';
  }
  if (name.includes('creatinine') || name.includes('urea') || name.includes('bun')) {
    return 'renal';
  }
  if (name.includes('alt') || name.includes('ast') || name.includes('bilirubin') || name.includes('sgpt') || name.includes('sgot')) {
    return 'liver';
  }
  
  return 'other';
};

const generateTrendInsight = (
  parameter: string,
  values: Array<{ date: string; value: number; normalMin: number; normalMax: number }>,
  t: (key: string, params?: Record<string, string>) => string
): TrendInsight | null => {
  if (values.length < 2) return null;

  const sorted = values.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];
  
  const change = latest.value - previous.value;
  const percentage = Math.abs(change / previous.value) * 100;
  const days = Math.ceil((new Date(latest.date).getTime() - new Date(previous.date).getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine if the trend is improving, worsening, or stable
  let trend: 'improving' | 'worsening' | 'stable' = 'stable';
  
  if (Math.abs(percentage) < 5) {
    trend = 'stable';
  } else {
    // For parameters like glucose, cholesterol (lower is better)
    const lowerIsBetter = parameter.toLowerCase().includes('glucose') || 
                         parameter.toLowerCase().includes('cholesterol') ||
                         parameter.toLowerCase().includes('ldl') ||
                         parameter.toLowerCase().includes('creatinine');
    
    if (lowerIsBetter) {
      trend = change < 0 ? 'improving' : 'worsening';
    } else {
      // For parameters like HDL, hemoglobin (higher is better within range)
      trend = change > 0 ? 'improving' : 'worsening';
    }
  }

  return {
    parameter,
    trend,
    change: Math.abs(change),
    percentage,
    days,
    unit: '' // Will be filled from the actual data
  };
};

const TrendCard: React.FC<{
  insight: TrendInsight;
  values: Array<{ date: string; value: number; normalMin: number; normalMax: number }>;
  t: (key: string, params?: Record<string, string>) => string;
}> = ({ insight, values, t }) => {
  const chartData = values.map(v => ({
    date: new Date(v.date).toLocaleDateString(),
    value: v.value,
    normalMin: v.normalMin,
    normalMax: v.normalMax
  }));

  const TrendIcon = insight.trend === 'improving' ? TrendingUp : 
                   insight.trend === 'worsening' ? TrendingDown : Minus;
  
  const trendColor = insight.trend === 'improving' ? 'text-green-600' : 
                    insight.trend === 'worsening' ? 'text-red-600' : 'text-gray-600';

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{insight.parameter}</CardTitle>
          <TrendIcon className={`h-5 w-5 ${trendColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-40 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: any) => [value, t('common.value')]}
                labelFormatter={(label) => `${t('common.date')}: ${label}`}
              />
              <ReferenceLine 
                y={chartData[0]?.normalMin} 
                stroke="#10b981" 
                strokeDasharray="3 3" 
                opacity={0.7}
              />
              <ReferenceLine 
                y={chartData[0]?.normalMax} 
                stroke="#10b981" 
                strokeDasharray="3 3" 
                opacity={0.7}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground">
          {insight.parameter} {t(`lab.comparison.${insight.change > 0 ? 'increased' : 'decreased'}`)} {' '}
          {insight.change.toFixed(1)} ({insight.percentage.toFixed(1)}%) {' '}
          {t('lab.comparison.in.days', { days: insight.days.toString() })} — {' '}
          <span className={trendColor}>
            {t(`lab.comparison.${insight.trend}`)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export const EnhancedReportComparisonDialog: React.FC<EnhancedReportComparisonProps> = ({
  selectedReports,
  reports,
  open,
  onOpenChange,
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [timeWindow, setTimeWindow] = useState<string>("all");
  const [onlyAbnormal, setOnlyAbnormal] = useState(false);
  const [selectedParams, setSelectedParams] = useState<string[]>([]);

  // Sort selected reports by date
  const sortedSelectedReports = (selectedReports || []).sort((a: any, b: any) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const selectedVisitIds = sortedSelectedReports.map((s: any) =>
    typeof s === "object" && s !== null ? s.visitId : s
  );

  const selectedData = (reports || [])
    .filter((report) => selectedVisitIds.includes(report.visitId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get all parameters grouped by category
  const parametersByCategory = useMemo(() => {
    const categories: Record<string, string[]> = {};
    
    selectedData.forEach((report) =>
      report.result.forEach((r) => {
        const category = getParameterCategory(r.detail_description);
        if (!categories[category]) categories[category] = [];
        if (!categories[category].includes(r.detail_description)) {
          categories[category].push(r.detail_description);
        }
      })
    );

    return categories;
  }, [selectedData]);

  // Filter parameters based on search and category
  const filteredParameters = useMemo(() => {
    let allParams: string[] = [];
    
    if (selectedCategory === "all") {
      allParams = Object.values(parametersByCategory).flat();
    } else {
      allParams = parametersByCategory[selectedCategory] || [];
    }

    if (searchTerm) {
      allParams = allParams.filter(param =>
        param.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (onlyAbnormal) {
      allParams = allParams.filter(paramName => {
        return selectedData.some(report => {
          const result = report.result.find(r => r.detail_description === paramName);
          if (!result) return false;
          
          const value = Number(result.actual_result);
          const min = Number(result.min_value);
          const max = Number(result.max_value);
          
          return value < min || value > max;
        });
      });
    }

    return allParams;
  }, [parametersByCategory, selectedCategory, searchTerm, onlyAbnormal, selectedData]);

  // Auto-select first few parameters if none selected
  useEffect(() => {
    if (selectedParams.length === 0 && filteredParameters.length > 0) {
      setSelectedParams(filteredParameters.slice(0, 3));
    }
  }, [filteredParameters, selectedParams.length]);

  // Generate trend insights
  const trendInsights = useMemo(() => {
    return selectedParams.map(param => {
      const values = selectedData
        .map(report => {
          const result = report.result.find(r => r.detail_description === param);
          if (!result || result.actual_result === "-" || isNaN(Number(result.actual_result))) {
            return null;
          }
          
          return {
            date: report.date,
            value: Number(result.actual_result),
            normalMin: Number(result.min_value),
            normalMax: Number(result.max_value)
          };
        })
        .filter(Boolean)
        .sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime()) as Array<{
        date: string;
        value: number;
        normalMin: number;
        normalMax: number;
      }>;

      const insight = generateTrendInsight(param, values, t);
      return insight ? { insight, values } : null;
    }).filter(Boolean) as Array<{ insight: TrendInsight; values: any[] }>;
  }, [selectedParams, selectedData, t]);

  const categories = Object.keys(parametersByCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t('lab.comparison.title')}</DialogTitle>
          <DialogDescription>
            {t('lab.comparison.select.dates')} ({selectedData.length} {t('common.date').toLowerCase()})
          </DialogDescription>
        </DialogHeader>

        {/* Mobile-first filters */}
        <div className="flex-shrink-0 space-y-3 border-b pb-4">
          {/* Search and Category Filter Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('lab.comparison.select.parameters')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('lab.filter.all')}</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {t(`category.${cat}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Window and Abnormal Filter */}
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <div className="flex gap-2">
              <Button
                variant={timeWindow === "3m" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeWindow("3m")}
              >
                {t('lab.filter.3months')}
              </Button>
              <Button
                variant={timeWindow === "6m" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeWindow("6m")}
              >
                {t('lab.filter.6months')}
              </Button>
              <Button
                variant={timeWindow === "1y" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeWindow("1y")}
              >
                {t('lab.filter.1year')}
              </Button>
              <Button
                variant={timeWindow === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeWindow("all")}
              >
                {t('lab.filter.all')}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="abnormal-only"
                checked={onlyAbnormal}
                onCheckedChange={(checked) => setOnlyAbnormal(!!checked)}
              />
              <label htmlFor="abnormal-only" className="text-sm">
                {t('lab.filter.only.abnormal')}
              </label>
            </div>
          </div>

          {/* Parameter Selection Chips */}
          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
            {filteredParameters.map((param) => (
              <Badge
                key={param}
                variant={selectedParams.includes(param) ? "default" : "outline"}
                className="cursor-pointer text-xs px-2 py-1"
                onClick={() => {
                  setSelectedParams(prev =>
                    prev.includes(param)
                      ? prev.filter(p => p !== param)
                      : [...prev, param]
                  );
                }}
              >
                {param}
              </Badge>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {trendInsights.length > 0 ? (
            <>
              {/* Trend Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trendInsights.map(({ insight, values }, index) => (
                  <TrendCard
                    key={index}
                    insight={insight}
                    values={values}
                    t={t}
                  />
                ))}
              </div>

              {/* Comparison Table */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('lab.comparison.title')}</CardTitle>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <FileDown className="h-4 w-4 mr-2" />
                      {t('common.export.pdf')}
                    </Button>
                    <Button size="sm" variant="outline">
                      {t('common.export.csv')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="sticky left-0 bg-background min-w-48">
                            Parameter
                          </TableHead>
                          {selectedData.map((report, index) => (
                            <TableHead key={index} className="text-center min-w-32">
                              {new Date(report.date).toLocaleDateString()}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedParams.map((param) => (
                          <TableRow key={param}>
                            <TableCell className="sticky left-0 bg-background font-medium">
                              <div className="text-sm">{param}</div>
                            </TableCell>
                            {selectedData.map((report, reportIndex) => {
                              const result = report.result.find(r => r.detail_description === param);
                              if (!result || result.actual_result === "-") {
                                return (
                                  <TableCell key={reportIndex} className="text-center text-muted-foreground">
                                    -
                                  </TableCell>
                                );
                              }

                              const value = Number(result.actual_result);
                              const min = Number(result.min_value);
                              const max = Number(result.max_value);
                              const isNormal = value >= min && value <= max;

                              return (
                                <TableCell key={reportIndex} className="text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    <span className={isNormal ? "text-foreground" : "text-red-600 font-semibold"}>
                                      {value}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {result.unitdesc}
                                    </span>
                                  </div>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center">
                <p className="text-lg font-medium mb-2">{t('common.no.data')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('lab.comparison.select.parameters')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};