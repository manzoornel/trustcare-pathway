// Groups raw Grandis test names (report.result[].detail_description) into
// clinically meaningful panels, so a patient can compare "my cholesterol"
// instead of picking individual sub-tests one by one. Matching is a
// case-insensitive substring check against these keyword lists, since the
// lab source doesn't tag tests with a panel/category of its own. Panel
// names follow the standard names patients already see on Indian lab
// reports (Lipid Profile, Thyroid Function Test, etc.) rather than
// inventing new terminology.

export interface LabCategory {
  id: string;
  label: string;
  labelMl: string;
  keywords: string[];
}

export const LAB_CATEGORIES: LabCategory[] = [
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
    id: "lipid",
    label: "Lipid Profile",
    labelMl: "ലിപിഡ് പ്രൊഫൈൽ",
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
    id: "cbc",
    label: "Complete Blood Count (CBC)",
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
  {
    id: "thyroid",
    label: "Thyroid Function Test",
    labelMl: "തൈറോയ്ഡ് ടെസ്റ്റ്",
    keywords: ["thyroid", "tsh", " t3", " t4", "ft3", "ft4", "triiodothyronine", "thyroxine"],
  },
  {
    id: "renal",
    label: "Kidney Function Test",
    labelMl: "കിഡ്നി ടെസ്റ്റ്",
    keywords: [
      "urea",
      "creatinine",
      "uric acid",
      "egfr",
      "kidney",
      "renal",
      "bun",
    ],
  },
  {
    id: "liver",
    label: "Liver Function Test",
    labelMl: "ലിവർ ടെസ്റ്റ്",
    keywords: [
      "sgot",
      "sgpt",
      "bilirubin",
      "alkaline phosphatase",
      "liver",
      "ast",
      "alt ",
      "albumin",
      "globulin",
      "protein",
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
