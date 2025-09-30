import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ml';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

interface Translations {
  [key: string]: {
    en: string;
    ml: string;
  };
}

const translations: Translations = {
  // Lab Reports
  'lab.reports.title': {
    en: 'Lab Reports',
    ml: 'ലാബ് റിപ്പോർട്ടുകൾ'
  },
  'lab.reports.subtitle': {
    en: 'View and compare your medical test results',
    ml: 'നിങ്ങളുടെ മെഡിക്കൽ പരിശോധനാ ഫലങ്ങൾ കാണുകയും താരതമ്യം ചെയ്യുകയും ചെയ്യുക'
  },
  'lab.search.placeholder': {
    en: 'Search reports...',
    ml: 'റിപ്പോർട്ടുകൾ തിരയുക...'
  },
  'lab.compare.button': {
    en: 'Compare Reports',
    ml: 'റിപ്പോർട്ടുകൾ താരതമ്യം ചെയ്യുക'
  },
  'lab.compare.cancel': {
    en: 'Cancel Compare',
    ml: 'താരതമ്യം റദ്ദാക്കുക'
  },
  'lab.compare.selected': {
    en: 'Compare Selected ({{count}})',
    ml: 'തിരഞ്ഞെടുത്തവ താരതമ്യം ചെയ്യുക ({{count}})'
  },
  'lab.table.type': {
    en: 'Type',
    ml: 'തരം'
  },
  'lab.table.ordered_by': {
    en: 'Ordered By',
    ml: 'ഓർഡർ ചെയ്തത്'
  },
  'lab.table.actions': {
    en: 'Actions',
    ml: 'പ്രവർത്തനങ്ങൾ'
  },
  'lab.table.view_report': {
    en: 'View Report',
    ml: 'റിപ്പോർട്ട് കാണുക'
  },
  'lab.table.no_reports': {
    en: 'No lab reports found.',
    ml: 'ലാബ് റിപ്പോർട്ടുകളൊന്നുമില്ല.'
  },
  'lab.verification.title': {
    en: 'Email Not Verified',
    ml: 'ഇമെയിൽ പരിശോധിച്ചിട്ടില്ല'
  },
  'lab.verification.message': {
    en: 'Please verify your email to access lab reports.',
    ml: 'ലാബ് റിപ്പോർട്ടുകൾ ആക്സസ്സ് ചെയ്യാൻ ദയവായി നിങ്ങളുടെ ഇമെയിൽ പരിശോധിക്കുക.'
  },
  'lab.verification.button': {
    en: 'Verify Email',
    ml: 'ഇമെയിൽ പരിശോധിക്കുക'
  },
  
  // Lab Comparison Page
  'lab.comparison.title': {
    en: 'Compare Lab Results',
    ml: 'ലാബ് ഫലങ്ങളുടെ താരതമ്യം'
  },
  'lab.comparison.select.dates': {
    en: 'Select at least two dates to compare',
    ml: 'കുറഞ്ഞത് രണ്ട് തീയതികൾ തിരഞ്ഞെടുക്കുക'
  },
  'lab.comparison.add.date': {
    en: '+ Add another date',
    ml: '+ മറ്റൊരു തീയതി ചേർക്കുക'
  },
  'lab.comparison.select.parameters': {
    en: 'Select parameters to compare',
    ml: 'താരതമ്യം ചെയ്യാൻ പാരാമീറ്ററുകൾ തിരഞ്ഞെടുക്കുക'
  },
  'lab.comparison.normal.range': {
    en: 'Normal Range',
    ml: 'സാധാരണ പരിധി'
  },
  'lab.comparison.improving': {
    en: 'improving',
    ml: 'പുരോഗതി'
  },
  'lab.comparison.worsening': {
    en: 'worsening',
    ml: 'വഷളാകുന്നു'
  },
  'lab.comparison.stable': {
    en: 'stable',
    ml: 'സ്ഥിരം'
  },
  'lab.comparison.decreased': {
    en: 'decreased',
    ml: 'കുറഞ്ഞു'
  },
  'lab.comparison.increased': {
    en: 'increased',
    ml: 'വർധിച്ചു'
  },
  'lab.comparison.in.days': {
    en: 'in {{days}} days',
    ml: '{{days}} ദിവസത്തിൽ'
  },
  'lab.filter.3months': {
    en: '3 Months',
    ml: '3 മാസം'
  },
  'lab.filter.6months': {
    en: '6 Months',
    ml: '6 മാസം'
  },
  'lab.filter.1year': {
    en: '1 Year',
    ml: '1 വർഷം'
  },
  'lab.filter.all': {
    en: 'All',
    ml: 'എല്ലാം'
  },
  'lab.filter.only.abnormal': {
    en: 'Only Abnormal',
    ml: 'അസാധാരണം മാത്രം'
  },
  'common.date': {
    en: 'Date',
    ml: 'തീയതി'
  },
  'common.value': {
    en: 'Value',
    ml: 'മൂല്യം'
  },
  'common.export.pdf': {
    en: 'Export PDF',
    ml: 'PDF എക്സ്പോർട്ട്'
  },
  'common.export.csv': {
    en: 'Export CSV',
    ml: 'CSV എക്സ്പോർട്ട്'
  },
  'common.download': {
    en: 'Download',
    ml: 'ഡൗൺലോഡ്'
  },
  'common.share': {
    en: 'Share',
    ml: 'പങ്കിടുക'
  },
  'common.loading': {
    en: 'Loading...',
    ml: 'ലോഡ് ചെയ്യുന്നു...'
  },
  'common.no.data': {
    en: 'No data available',
    ml: 'ഡാറ്റയൊന്നുമില്ല'
  },
  'error.unit.mismatch': {
    en: 'This parameter uses different units across reports; please normalize in EHR.',
    ml: 'ഈ പാരാമീറ്റർ വിവിധ റിപ്പോർട്ടുകളിൽ വ്യത്യസ്ത യൂണിറ്റുകൾ ഉപയോഗിക്കുന്നു; ദയവായി EHR-ൽ സാധാരണവൽക്കരിക്കുക.'
  },
  // Categories
  'category.biochemistry': {
    en: 'Biochemistry',
    ml: 'ബയോകെമിസ്ട്രി'
  },
  'category.hematology': {
    en: 'Hematology',
    ml: 'ഹീമറ്റോളജി'
  },
  'category.thyroid': {
    en: 'Thyroid',
    ml: 'തൈറോയ്ഡ്'
  },
  'category.lipids': {
    en: 'Lipids',
    ml: 'ലിപിഡുകൾ'
  },
  'category.renal': {
    en: 'Renal',
    ml: 'വൃക്ക'
  },
  'category.liver': {
    en: 'Liver',
    ml: 'കരൾ'
  },
  // Vitals
  'vitals.comparison.title': {
    en: 'Vitals Comparison',
    ml: 'വൈറ്റലുകളുടെ താരതമ്യം'
  },
  'vitals.blood.pressure': {
    en: 'Blood Pressure',
    ml: 'രക്തസമ്മർദ്ദം'
  },
  'vitals.heart.rate': {
    en: 'Heart Rate',
    ml: 'ഹൃദയമിടിപ്പ്'
  },
  'vitals.temperature': {
    en: 'Temperature',
    ml: 'താപനില'
  },
  'vitals.weight': {
    en: 'Weight',
    ml: 'ഭാരം'
  },
  'vitals.height': {
    en: 'Height',
    ml: 'ഉയരം'
  },
  
  // Medical Parameters - Biochemistry
  'param.fbs': {
    en: 'Fasting Blood Sugar',
    ml: 'ഉപവാസ രക്തത്തിലെ പഞ്ചസാര'
  },
  'param.ppbs': {
    en: 'Post Prandial Blood Sugar',
    ml: 'ഭക്ഷണശേഷം രക്തത്തിലെ പഞ്ചസാര'
  },
  'param.rbs': {
    en: 'Random Blood Sugar',
    ml: 'റാൻഡം രക്തത്തിലെ പഞ്ചസാര'
  },
  'param.hba1c': {
    en: 'HbA1c',
    ml: 'എച്ച്ബിഎ1സി'
  },
  'param.glucose': {
    en: 'Glucose',
    ml: 'ഗ്ലൂക്കോസ്'
  },
  
  // Medical Parameters - Hematology
  'param.hemoglobin': {
    en: 'Hemoglobin',
    ml: 'ഹീമോഗ്ലോബിൻ'
  },
  'param.wbc': {
    en: 'White Blood Cells',
    ml: 'വെളുത്ത രക്താണുക്കൾ'
  },
  'param.rbc': {
    en: 'Red Blood Cells',
    ml: 'ചുവന്ന രക്താണുക്കൾ'
  },
  'param.platelet': {
    en: 'Platelet Count',
    ml: 'പ്ലേറ്റ്‌ലെറ്റ് എണ്ണം'
  },
  'param.hematocrit': {
    en: 'Hematocrit',
    ml: 'ഹെമറ്റോക്രിറ്റ്'
  },
  'param.mcv': {
    en: 'Mean Corpuscular Volume',
    ml: 'ശരാശരി കോർപ്പസ്‌ക്യുലർ വോള്യം'
  },
  'param.mch': {
    en: 'Mean Corpuscular Hemoglobin',
    ml: 'ശരാശരി കോർപ്പസ്‌ക്യുലർ ഹീമോഗ്ലോബിൻ'
  },
  'param.mchc': {
    en: 'Mean Corpuscular Hemoglobin Concentration',
    ml: 'ശരാശരി കോർപ്പസ്‌ക്യുലർ ഹീമോഗ്ലോബിൻ സാന്ദ്രത'
  },
  
  // Medical Parameters - Thyroid
  'param.tsh': {
    en: 'Thyroid Stimulating Hormone',
    ml: 'തൈറോയ്ഡ് ഉത്തേജക ഹോർമോൺ'
  },
  'param.t3': {
    en: 'Triiodothyronine (T3)',
    ml: 'ട്രയോഡോതൈറോണിൻ (ടി3)'
  },
  'param.t4': {
    en: 'Thyroxine (T4)',
    ml: 'തൈറോക്സിൻ (ടി4)'
  },
  'param.ft3': {
    en: 'Free T3',
    ml: 'ഫ്രീ ടി3'
  },
  'param.ft4': {
    en: 'Free T4',
    ml: 'ഫ്രീ ടി4'
  },
  
  // Medical Parameters - Lipids
  'param.cholesterol': {
    en: 'Total Cholesterol',
    ml: 'മൊത്തം കൊളസ്‌ട്രോൾ'
  },
  'param.ldl': {
    en: 'LDL Cholesterol',
    ml: 'എൽഡിഎൽ കൊളസ്‌ട്രോൾ'
  },
  'param.hdl': {
    en: 'HDL Cholesterol',
    ml: 'എച്ച്ഡിഎൽ കൊളസ്‌ട്രോൾ'
  },
  'param.triglycerides': {
    en: 'Triglycerides',
    ml: 'ട്രൈഗ്ലിസറൈഡുകൾ'
  },
  'param.vldl': {
    en: 'VLDL Cholesterol',
    ml: 'വിഎൽഡിഎൽ കൊളസ്‌ട്രോൾ'
  },
  
  // Medical Parameters - Renal
  'param.creatinine': {
    en: 'Creatinine',
    ml: 'ക്രിയാറ്റിനിൻ'
  },
  'param.urea': {
    en: 'Blood Urea',
    ml: 'രക്തത്തിലെ യൂറിയ'
  },
  'param.bun': {
    en: 'Blood Urea Nitrogen',
    ml: 'രക്ത യൂറിയ നൈട്രജൻ'
  },
  'param.uric_acid': {
    en: 'Uric Acid',
    ml: 'യൂറിക് ആസിഡ്'
  },
  'param.sodium': {
    en: 'Sodium',
    ml: 'സോഡിയം'
  },
  'param.potassium': {
    en: 'Potassium',
    ml: 'പൊട്ടാസ്യം'
  },
  'param.chloride': {
    en: 'Chloride',
    ml: 'ക്ലോറൈഡ്'
  },
  
  // Medical Parameters - Liver
  'param.sgpt': {
    en: 'SGPT/ALT',
    ml: 'എസ്ജിപിടി/എഎൽടി'
  },
  'param.sgot': {
    en: 'SGOT/AST',
    ml: 'എസ്ജിഒടി/എഎസ്ടി'
  },
  'param.alt': {
    en: 'Alanine Transaminase',
    ml: 'അലനൈൻ ട്രാൻസാമിനേസ്'
  },
  'param.ast': {
    en: 'Aspartate Transaminase',
    ml: 'അസ്പാർട്ടേറ്റ് ട്രാൻസാമിനേസ്'
  },
  'param.bilirubin_total': {
    en: 'Total Bilirubin',
    ml: 'മൊത്തം ബിലിറൂബിൻ'
  },
  'param.bilirubin_direct': {
    en: 'Direct Bilirubin',
    ml: 'ഡയറക്ട് ബിലിറൂബിൻ'
  },
  'param.bilirubin_indirect': {
    en: 'Indirect Bilirubin',
    ml: 'ഇൻഡയറക്ട് ബിലിറൂബിൻ'
  },
  'param.alp': {
    en: 'Alkaline Phosphatase',
    ml: 'ആൽക്കലൈൻ ഫോസ്ഫേറ്റേസ്'
  },
  'param.ggt': {
    en: 'Gamma-Glutamyl Transferase',
    ml: 'ഗാമ-ഗ്ലൂട്ടമിൽ ട്രാൻസ്ഫറേസ്'
  },
  'param.protein_total': {
    en: 'Total Protein',
    ml: 'മൊത്തം പ്രോട്ടീൻ'
  },
  'param.albumin': {
    en: 'Albumin',
    ml: 'ആൽബുമിൻ'
  },
  'param.globulin': {
    en: 'Globulin',
    ml: 'ഗ്ലോബുലിൻ'
  },
  
  // Medical Parameters - Other
  'param.esr': {
    en: 'Erythrocyte Sedimentation Rate',
    ml: 'എറിത്രോസൈറ്റ് സെഡിമെന്റേഷൻ നിരക്ക്'
  },
  'param.vitamin_d': {
    en: 'Vitamin D',
    ml: 'വിറ്റാമിൻ ഡി'
  },
  'param.vitamin_b12': {
    en: 'Vitamin B12',
    ml: 'വിറ്റാമിൻ ബി12'
  },
  'param.calcium': {
    en: 'Calcium',
    ml: 'കാൽസ്യം'
  },
  'param.phosphorus': {
    en: 'Phosphorus',
    ml: 'ഫോസ്ഫറസ്'
  },
  'param.iron': {
    en: 'Iron',
    ml: 'ഇരുമ്പ്'
  },
  'param.ferritin': {
    en: 'Ferritin',
    ml: 'ഫെറിറ്റിൻ'
  },
  
  // Status Terms
  'status.high': {
    en: 'High',
    ml: 'ഉയർന്നത്'
  },
  'status.low': {
    en: 'Low',
    ml: 'താഴ്ന്നത്'
  },
  'status.normal': {
    en: 'Normal',
    ml: 'സാധാരണം'
  },
  'status.critical': {
    en: 'Critical',
    ml: 'ഗുരുതരം'
  },
  'status.abnormal': {
    en: 'Abnormal',
    ml: 'അസാധാരണം'
  },
  
  // Units
  'unit.mg_dl': {
    en: 'mg/dL',
    ml: 'mg/dL'
  },
  'unit.g_dl': {
    en: 'g/dL',
    ml: 'g/dL'
  },
  'unit.cells_cumm': {
    en: 'cells/cumm',
    ml: 'സെല്ലുകൾ/cumm'
  },
  'unit.percent': {
    en: '%',
    ml: '%'
  },
  'unit.uiu_ml': {
    en: 'µIU/mL',
    ml: 'µIU/mL'
  },
  'unit.ng_ml': {
    en: 'ng/mL',
    ml: 'ng/mL'
  },
  'unit.mmol_l': {
    en: 'mmol/L',
    ml: 'mmol/L'
  },
  'unit.meq_l': {
    en: 'mEq/L',
    ml: 'mEq/L'
  },
  'unit.u_l': {
    en: 'U/L',
    ml: 'U/L'
  },
  'unit.iu_l': {
    en: 'IU/L',
    ml: 'IU/L'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('doctorUncleLanguage');
      return (saved as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (newLanguage: Language) => {
    try {
      localStorage.setItem('doctorUncleLanguage', newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[key]?.[language] || translations[key]?.en || key;
    
    if (!params) return translation;
    
    // Simple parameter replacement for {{key}} patterns
    return Object.entries(params).reduce((text, [key, value]) => {
      return text.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }, translation);
  };

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = language === 'ml' ? 'ml' : 'en';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};