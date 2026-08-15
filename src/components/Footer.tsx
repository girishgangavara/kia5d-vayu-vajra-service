import { Plane, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-12 border-t border-border relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-foreground">
                {t('KIA-5D Vayu Vajra', 'ಕೆಐಎ-೫ಡಿ ವಾಯು ವಜ್ರ')}
              </span>
              <p className="text-xs text-muted-foreground">
                {t('BMTC Premium Airport Service', 'ಬಿಎಂಟಿಸಿ ಪ್ರೀಮಿಯಂ ವಿಮಾನ ನಿಲ್ದಾಣ ಸೇವೆ')}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://mybmtc.karnataka.gov.in/en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              BMTC Official <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
            <a
              href="https://www.bengaluruairport.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              BLR Airport <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
            <a
              href="https://www.artofliving.org/in-en/bangalore-ashram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              Art of Living <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} {t('KIA-5D Vayu Vajra Service', 'ಕೆಐಎ-೫ಡಿ ವಾಯು ವಜ್ರ ಸೇವೆ')}
            <br />
            {t(
              'An initiative by BMTC and Girish, Government of Karnataka',
              'ಬಿಎಂಟಿಸಿ ಮತ್ತು ಗಿರೀಶ್ ಅವರ ಉಪಕ್ರಮ, ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
