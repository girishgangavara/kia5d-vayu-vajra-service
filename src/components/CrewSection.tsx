import { UserCheck, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  buildServices,
  fetchAssignments,
  istToday,
  splitCrewName,
  to12Hour,
} from '@/lib/kia5d';
import { SectionState } from './SectionState';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Crew on duty per KIA-5D service, published by the depot's assignment cron.
 *
 * Phone numbers are never requested or rendered: the `mobile` column is left
 * out of the query in src/lib/kia5d.ts, matching the KIA-15 site, which also
 * publishes crew names without contact details.
 */
const CrewSection = () => {
  const { t } = useLanguage();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assignments'],
    queryFn: fetchAssignments,
    staleTime: 5 * 60 * 1000,
  });

  const services = data ? buildServices(data) : [];

  return (
    <section id="crew" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t('Crew on Duty', 'ಕರ್ತವ್ಯದಲ್ಲಿರುವ ಸಿಬ್ಬಂದಿ')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t(
              'Crew assigned to each KIA-5D service today',
              'ಇಂದು ಪ್ರತಿ ಕೆಐಎ-೫ಡಿ ಸೇವೆಗೆ ನಿಯೋಜಿಸಲಾದ ಸಿಬ್ಬಂದಿ',
            )}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <SectionState
            isLoading={isLoading}
            isError={isError}
            isEmpty={!isLoading && !isError && services.length === 0}
            loadingLabel={t('Loading crew details…', 'ಸಿಬ್ಬಂದಿ ವಿವರ ಲೋಡ್ ಆಗುತ್ತಿದೆ…')}
            errorLabel={t('Unable to load crew details.', 'ಸಿಬ್ಬಂದಿ ವಿವರ ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.')}
            emptyLabel={t('No crew information available.', 'ಸಿಬ್ಬಂದಿ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.')}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => {
                const { kn, en } = splitCrewName(service.crewName);
                return (
                  <article
                    key={service.routeNo}
                    className="glass-strong rounded-2xl p-6 shadow-card"
                  >
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <h3 className="font-bold text-foreground">
                        KIA-5D / {service.serviceNo}
                      </h3>
                      <span className="font-mono text-xs text-muted-foreground break-all text-right">
                        {service.vehicleNumber ?? '—'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {service.photo ? (
                        <img
                          src={service.photo}
                          alt={
                            en
                              ? t(`Crew member ${en}`, `ಸಿಬ್ಬಂದಿ ${en}`)
                              : t('Crew member photo', 'ಸಿಬ್ಬಂದಿ ಚಿತ್ರ')
                          }
                          loading="lazy"
                          className="w-14 h-14 rounded-full object-cover border-2 border-primary/40 shrink-0"
                        />
                      ) : (
                        <div
                          className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shrink-0"
                          aria-hidden="true"
                        >
                          <UserCheck className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}

                      <div className="min-w-0">
                        {en ? (
                          <>
                            <p className="font-semibold text-foreground break-words">{en}</p>
                            {kn && (
                              <p className="text-sm text-muted-foreground break-words">{kn}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {t('Crew not published', 'ಸಿಬ್ಬಂದಿ ಪ್ರಕಟಿಸಿಲ್ಲ')}
                          </p>
                        )}
                        {service.crewId && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {t('Badge', 'ಬ್ಯಾಡ್ಜ್')} #{service.crewId}
                          </p>
                        )}
                      </div>
                    </div>

                    {service.trips.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                          <span className="text-xs font-medium text-accent">
                            {t('Trips', 'ಪ್ರಯಾಣಗಳು')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {service.trips.map(trip => (
                            <span
                              key={`${trip.time}-${trip.direction}`}
                              className="glass px-2 py-1 rounded text-xs text-foreground"
                            >
                              {to12Hour(trip.time)}{' '}
                              <span className="text-muted-foreground">
                                {trip.direction === 'toAirport' ? '→ KIA' : '→ AOL'}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              {t('Assignments published for', 'ನಿಯೋಜನೆ ಪ್ರಕಟಿಸಿದ ದಿನಾಂಕ')} {istToday()} (IST).{' '}
              {t(
                'Crew contact numbers are not published on this site.',
                'ಸಿಬ್ಬಂದಿ ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳನ್ನು ಪ್ರಕಟಿಸಲಾಗಿಲ್ಲ.',
              )}
            </p>
          </SectionState>
        </div>
      </div>
    </section>
  );
};

export default CrewSection;
