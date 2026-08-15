import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
      title={language === 'en' ? 'Switch to Kannada' : 'Switch to English'}
    >
      <Languages className="w-4 h-4" />
      <span>{language === 'en' ? 'ಕನ್ನಡ' : 'EN'}</span>
    </button>
  );
};

export default LanguageToggle;
