
import { VitalType, VitalTypeInfo } from "./types";

export const vitalTypes: VitalTypeInfo[] = [
  {
    type: "blood_pressure",
    label: "Blood Pressure",
    unit: "mmHg",
    icon: "activity",
    normalRange: "90/60 - 120/80",
    description: "Pressure of blood against artery walls"
  },
  {
    type: "heart_rate",
    label: "Heart Rate",
    unit: "bpm",
    icon: "heart-pulse",
    normalRange: "60 - 100",
    description: "Number of heartbeats per minute"
  },
  {
    type: "temperature",
    label: "Temperature",
    unit: "°C",
    icon: "thermometer",
    normalRange: "36.1 - 37.2",
    description: "Body temperature"
  },
  {
    type: "respiratory_rate",
    label: "Respiratory Rate",
    unit: "bpm",
    icon: "activity",
    normalRange: "12 - 20",
    description: "Number of breaths per minute"
  },
  {
    type: "oxygen_saturation",
    label: "Oxygen Saturation",
    unit: "%",
    icon: "activity",
    normalRange: "95 - 100",
    description: "Percentage of oxygen-saturated hemoglobin"
  },
  {
    type: "blood_glucose",
    label: "Blood Glucose",
    unit: "mg/dL",
    icon: "activity",
    normalRange: "80 - 130",
    description: "Blood sugar level"
  },
  {
    type: "weight",
    label: "Weight",
    unit: "kg",
    icon: "activity",
    normalRange: "varies",
    description: "Body weight"
  }
];

export const getVitalTypeInfo = (type: VitalType): VitalTypeInfo => {
  return vitalTypes.find(vt => vt.type === type) || vitalTypes[0];
};
