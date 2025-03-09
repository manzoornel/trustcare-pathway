
import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { VitalRecord, VitalTypeInfo } from "./mockData";

interface VitalChartProps {
  records: VitalRecord[];
  vitalType: VitalTypeInfo;
}

const VitalChart: React.FC<VitalChartProps> = ({ records, vitalType }) => {
  // Sort records by date (ascending)
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Format the data for the chart
  const data = sortedRecords.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    value: record.value,
    status: record.status
  }));
  
  // Extract normal range values if available
  let normalRangeMin: number | undefined;
  let normalRangeMax: number | undefined;
  
  if (vitalType.normalRange && vitalType.normalRange !== "varies") {
    const rangeMatch = vitalType.normalRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
    if (rangeMatch) {
      normalRangeMin = parseFloat(rangeMatch[1]);
      normalRangeMax = parseFloat(rangeMatch[2]);
    }
  }
  
  // Find min and max values for better visualization
  const values = records.map(r => r.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  // Add a 10% buffer to the min and max for better visualization
  const yAxisMin = Math.max(0, Math.floor(minValue - (maxValue - minValue) * 0.1));
  const yAxisMax = Math.ceil(maxValue + (maxValue - minValue) * 0.1);
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">{`${vitalType.label}: ${data.value} ${vitalType.unit}`}</p>
          <p className={`text-sm ${getStatusColor(data.status)}`}>
            Status: {data.status}
          </p>
        </div>
      );
    }
    return null;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'warning': return 'text-amber-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-medium mb-4">{vitalType.label} History</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              domain={[yAxisMin, yAxisMax]} 
              label={{ 
                value: vitalType.unit, 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {normalRangeMin !== undefined && (
              <ReferenceLine 
                y={normalRangeMin} 
                stroke="rgba(34, 197, 94, 0.6)" 
                strokeDasharray="3 3" 
                label={{ 
                  value: 'Min Normal', 
                  position: 'insideBottomRight', 
                  fill: 'rgba(34, 197, 94, 0.8)', 
                  fontSize: 12 
                }} 
              />
            )}
            
            {normalRangeMax !== undefined && (
              <ReferenceLine 
                y={normalRangeMax} 
                stroke="rgba(34, 197, 94, 0.6)" 
                strokeDasharray="3 3" 
                label={{ 
                  value: 'Max Normal', 
                  position: 'insideTopRight', 
                  fill: 'rgba(34, 197, 94, 0.8)', 
                  fontSize: 12 
                }} 
              />
            )}
            
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={{ 
                stroke: '#3b82f6', 
                strokeWidth: 2, 
                r: 4, 
                fill: '#fff' 
              }} 
              activeDot={{ 
                r: 6, 
                stroke: '#2563eb', 
                strokeWidth: 2, 
                fill: '#3b82f6' 
              }} 
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          No {vitalType.label.toLowerCase()} records found
        </div>
      )}
    </div>
  );
};

export default VitalChart;
