import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ml';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

interface Translations {
  [key: string]: {
    en: string;
    ml: string;
  };
}

const translations: Translations = {
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