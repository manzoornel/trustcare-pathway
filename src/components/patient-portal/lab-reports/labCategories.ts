// Groups raw Grandis test names (report.result[].detail_description) into
// clinically meaningful panels, so a patient can compare "my cholesterol"
// instead of picking individual sub-tests one by one. Matching is a
// case-insensitive substring check against these keyword lists, since the
// lab source doesn't tag tests with a panel/category of its own.

export interface LabCategory {
  id: string;
  label: string;
  labelMl: string;
  keywords: string[];
}

export const LAB_CATEGORIES: LabCategory[] = [
  {
    id: "lipid",
    label: "Lipid / Cholesterol Profile",
    labelMl: "കൊളസ്ട്രോൾ പ്രൊഫൈൽ",
    keywords: [
      "cholesterol",
      "triglyceride",
      "hdl",
      "ldl",
      "vldl",
      "lipid",
    ],
  },
  {
    id: "sugar",
    label: "Blood Sugar",
    labelMl: "ബ്ലഡ് ഷുഗർ",
    keywords: [
      "blood sugar",
      "glucose",
      "fbs",
      "ppbs",
      "rbs",
      "hba1c",
      "hb a1c",
      "glycosylated",
    ],
  },
  {
    id: "cbc",
    label: "CBC (Complete Blood Count + ESR)",
    labelMl: "സിബിസി",
    keywords: [
      "haemoglobin",
      "hemoglobin",
      "r.b.c",
      "rbc count",
      "w.b.c",
      "wbc count",
      "platelet",
      "polymorph",
      "lymphocyte",
      "eosinophil",
      "monocyte",
      "basophil",
      "pcv",
      "mcv",
      "mch",
      "esr",
      "total count",
      "differential count",
    ],
  },
];

export const testMatchesCategory = (testName: string, category: LabCategory): boolean => {
  const name = testName.toLowerCase();
  return category.keywords.some((k) => name.includes(k));
};

export const testMatchesAnyKeyword = (testName: string, keywords: string[]): boolean => {
  const name = testName.toLowerCase();
  return keywords.some((k) => name.includes(k));
};
