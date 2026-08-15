import { useState } from 'react';
import { MapPin, Plane, Building2, Train } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchStops } from '@/lib/kia5d';
import { SectionState } from './SectionState';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * KIA-5D stop list, in the KIA-15 timeline style, with a direction switch.
 * Stops come from KIA_Routes_Stops (routeNo = 'KIA-5D'), ordered by stopOrder.
 */
const RouteStops = () => {
  const { t } = useLanguage();
  const [direction, setDirection] = useState<'to_airport' | 'to_city'>('to_airport');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['stops'],
    queryFn: fetchStops,
    staleTime: 60 * 60 * 1000,
  });

  const stops = (data ?? [])
    .filter(s => s.direction === direction)
    .sort((a, b) => (a.stopOrder ?? 0) - (b.stopOrder ?? 0));

  const directions = [
    {
      key: 'to_airport' as const,
      label: t('Art of Living → Airport', 'ಆರ್ಟ್ ಆಫ್ ಲಿವಿಂಗ್ → ವಿಮಾನ ನಿಲ್ದಾಣ'),
    },
    {
      key: 'to_city' as const,
      label: t('Airport → Art of Living', 'ವಿಮಾನ ನಿಲ್ದಾಣ → ಆರ್ಟ್ ಆಫ್ ಲಿವಿಂಗ್'),
    },
  ];

  return (
    <section id="route" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t('Route & Stops', 'ಮಾರ್ಗ ಮತ್ತು ನಿಲ್ದಾಣಗಳು')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t(
              'Kempegowda International Airport ↔ Art of Living',
              'ಕೆಂಪೇಗೌಡ ಅಂತರರಾಷ್ಟ್ರೀಯ ವಿಮಾನ ನಿಲ್ದಾಣ ↔ ಆರ್ಟ್ ಆಫ್ ಲಿವಿಂಗ್',
            )}
          </p>
        </div>

        {/* Direction switch */}
        <div
          className="flex justify-center mb-10"
          role="tablist"
          aria-label={t('Travel direction', 'ಪ್ರಯಾಣದ ದಿಕ್ಕು')}
        >
          <div className="glass-strong rounded-full p-1 flex flex-wrap justify-center gap-1">
            {directions.map(d => (
              <button
                key={d.key}
                role="tab"
                aria-selected={direction === d.key}
                onClick={() => setDirection(d.key)}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  direction === d.key
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <SectionState
            isLoading={isLoading}
            isError={isError}
            isEmpty={!isLoading && !isError && stops.length === 0}
            loadingLabel={t('Loading route stops…', 'ನಿಲ್ದಾಣಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ…')}
            errorLabel={t('Unable to load route stops.', 'ನಿಲ್ದಾಣಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.')}
            emptyLabel={t('No route stops available.', 'ನಿಲ್ದಾಣ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.')}
          >
            <div className="glass-strong rounded-2xl p-5 sm:p-8 shadow-card">
              <ol className="relative">
                {stops.map((stop, index) => {
                  const isFirst = index === 0;
                  const isLast = index === stops.length - 1;
                  const name = stop.stationName ?? '';
                  const isMetro = /metro/i.test(name);
                  const isAirport = /airport|kia|terminal/i.test(name);

                  return (
                    <li key={`${stop.stopOrder}-${name}`} className="flex gap-4 group">
                      {/* Timeline rail */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-px flex-1 ${isFirst ? 'bg-transparent' : 'bg-border'}`}
                          aria-hidden="true"
                        />
                        <div
                          className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                            isFirst || isLast
                              ? 'bg-gradient-to-br from-primary to-accent text-white shadow-glow'
                              : isMetro
                                ? 'bg-secondary text-primary border border-primary/40'
                                : 'bg-secondary text-muted-foreground border border-border'
                          }`}
                        >
                          {isFirst || isLast ? (
                            isAirport ? (
                              <Plane className="w-3.5 h-3.5" aria-hidden="true" />
                            ) : (
                              <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                            )
                          ) : isMetro ? (
                            <Train className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div
                          className={`w-px flex-1 ${isLast ? 'bg-transparent' : 'bg-border'}`}
                          aria-hidden="true"
                        />
                      </div>

                      {/* Stop name */}
                      <div className="py-2 min-w-0 flex-1">
                        <p
                          className={`text-sm sm:text-base break-words ${
                            isFirst || isLast
                              ? 'font-semibold text-foreground'
                              : 'text-muted-foreground group-hover:text-foreground transition-colors'
                          }`}
                        >
                          {name}
                        </p>
                        {isMetro && (
                          <span className="text-[11px] text-primary">
                            {t('Metro interchange', 'ಮೆಟ್ರೋ ಸಂಪರ್ಕ')}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              <p className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {stops.length} {t('stops in this direction', 'ಈ ದಿಕ್ಕಿನಲ್ಲಿ ನಿಲ್ದಾಣಗಳು')}
              </p>
            </div>
          </SectionState>
        </div>
      </div>
    </section>
  );
};

export default RouteStops;
