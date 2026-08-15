import { useState, useEffect } from 'react';
import { Menu, X, Plane } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }, [isMenuOpen]);

  const { t } = useLanguage();

  const navLinks = [
    { href: '#route', label: t('Route', 'ಮಾರ್ಗ') },
    { href: '#schedule', label: t('Schedule', 'ವೇಳಾಪಟ್ಟಿ') },
    { href: '#vehicles', label: t('Vehicle', 'ವಾಹನ') },
    { href: '#crew', label: t('Crew', 'ಸಿಬ್ಬಂದಿ') },
    { href: '#amenities', label: t('Amenities', 'ಸೌಲಭ್ಯಗಳು') },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'glass-strong py-3' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow group-hover:shadow-gold transition-shadow">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-foreground">{t('KIA-5D', 'ಕೆಐಎ-೫ಡಿ')}</span>
              <span className="hidden sm:block text-xs text-muted-foreground">
                {t('Vayu Vajra', 'ವಾಯು ವಜ್ರ')}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Language Toggle & Live CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <a
              href="#live"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium text-sm hover:shadow-glow transition-shadow"
            >
              {t('Live Tracking', 'ನೇರ ಟ್ರ್ಯಾಕಿಂಗ್')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-expanded={isMenuOpen}
            aria-label={t('Toggle navigation menu', 'ಮೆನು ತೆರೆಯಿರಿ')}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-6 border-t border-border">
            <div className="flex flex-col gap-4 pt-6">

              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  {link.label}
                </a>
              ))}

              {/* Mobile Language Toggle */}
              <div className="mt-2">
                <LanguageToggle />
              </div>

              {/* Mobile Live CTA */}
              <a
                href="#live"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 w-full px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium text-sm text-center"
              >
                {t('Live Tracking', 'ನೇರ ಟ್ರ್ಯಾಕಿಂಗ್')}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
