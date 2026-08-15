import { Plane, Clock, MapPin, Bus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Bus3D from './Bus3D';
import ServiceStatus from './ServiceStatus';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildServices, fetchAssignments, fetchStops } from '@/lib/kia5d';

/**
 * KIA-5D hero. Mirrors the KIA-15 hero structure (badge, gradient headline,
 * quick-info chips, 3D bus, scroll cue); the counts come from Supabase rather
 * than being written into the markup, so they cannot drift from reality.
 */
const HeroSection = () => {
  const { t } = useLanguage();

  const services = useQuery({
    queryKey: ['assignments'],
    queryFn: fetchAssignments,
    staleTime: 5 * 60 * 1000,
  });

  const stops = useQuery({
    queryKey: ['stops'],
    queryFn: fetchStops,
    staleTime: 60 * 60 * 1000,
  });

  const fleetCount = services.data ? buildServices(services.data).length : null;
  const stopCount = stops.data
    ? new Set(
        stops.data
          .filter(s => s.direction === 'to_airport')
          .map(s => s.stationName),
      ).size
    : null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-medium text-accent">
              {t('Premium Airport Service', 'ಪ್ರೀಮಿಯಂ ವಿಮಾನ ನಿಲ್ದಾಣ ಸೇವೆ')}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="text-gradient">KIA-5D</span>
            <br />
            <span className="text-foreground">{t('Vayu Vajra', 'ವಾಯು ವಜ್ರ')}</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('Premium AC Volvo Service connecting', 'ಪ್ರೀಮಿಯಂ ಎಸಿ ವೋಲ್ವೋ ಸೇವೆ')}{' '}
            <span className="text-primary font-semibold">
              {t('Art of Living', 'ಆರ್ಟ್ ಆಫ್ ಲಿವಿಂಗ್')}
            </span>{' '}
            {t('to', 'ನಿಂದ')}{' '}
            <span className="text-accent font-semibold">
              {t('Kempegowda International Airport', 'ಕೆಂಪೇಗೌಡ ಅಂತರರಾಷ್ಟ್ರೀಯ ವಿಮಾನ ನಿಲ್ದಾಣ')}
            </span>
          </p>

          {/* Service status - derived from today's published data */}
          <div className="flex justify-center mb-8">
            <ServiceStatus />
          </div>

          {/* Quick info cards */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div
              className="glass-strong px-6 py-3 rounded-xl flex items-center gap-3 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Bus className="w-5 h-5 text-primary" />
              <span className="font-medium">
                {fleetCount === null
                  ? t('Fleet loading…', 'ಲೋಡ್ ಆಗುತ್ತಿದೆ…')
                  : `${fleetCount} ${t('Services', 'ಸೇವೆಗಳು')}`}
              </span>
            </div>
            <div
              className="glass-strong px-6 py-3 rounded-xl flex items-center gap-3 animate-slide-up"
              style={{ animationDelay: '0.3s' }}
            >
              <MapPin className="w-5 h-5 text-accent" />
              <span className="font-medium">
                {stopCount === null
                  ? t('Stops loading…', 'ಲೋಡ್ ಆಗುತ್ತಿದೆ…')
                  : `${stopCount} ${t('Stops', 'ನಿಲ್ದಾಣಗಳು')}`}
              </span>
            </div>
            <div
              className="glass-strong px-6 py-3 rounded-xl flex items-center gap-3 animate-slide-up"
              style={{ animationDelay: '0.4s' }}
            >
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">
                {t('Morning & Afternoon Trips', 'ಬೆಳಿಗ್ಗೆ ಮತ್ತು ಮಧ್ಯಾಹ್ನ')}
              </span>
            </div>
            <div
              className="glass-strong px-6 py-3 rounded-xl flex items-center gap-3 animate-slide-up"
              style={{ animationDelay: '0.5s' }}
            >
              <Plane className="w-5 h-5 text-accent" />
              <span className="font-medium">{t('Direct to Airport', 'ವಿಮಾನ ನಿಲ್ದಾಣಕ್ಕೆ ನೇರ')}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#schedule"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium text-sm hover:shadow-glow transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t('View Schedule', 'ವೇಳಾಪಟ್ಟಿ ನೋಡಿ')}
            </a>
            <a
              href="#route"
              className="px-6 py-3 rounded-full glass-strong font-medium text-sm hover:bg-primary/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t('View Route', 'ಮಾರ್ಗ ನೋಡಿ')}
            </a>
            <a
              href="#live"
              className="px-6 py-3 rounded-full glass-strong font-medium text-sm hover:bg-primary/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t('Track Bus', 'ಬಸ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ')}
            </a>
          </div>
        </div>

        {/* 3D Bus */}
        <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Bus3D />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-float-slow hidden lg:flex">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            {t('Scroll to Explore', 'ಸ್ಕ್ರಾಲ್ ಮಾಡಿ')}
          </span>
          <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
