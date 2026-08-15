import { Radio, MapPin, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { buildServices, fetchAssignments, fetchPositions } from '@/lib/kia5d';
import { SectionState } from './SectionState';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Live vehicle positions.
 *
 * The BMTC feed tags KIA-5D buses under the parent "KIA-5" route number, so a
 * route filter would miss them. Instead each service's assigned vehicle number
 * is matched against the feed - a position is only ever shown for a vehicle
 * that is genuinely reporting. Nothing is interpolated or estimated.
 */
const LiveTracking = () => {
  const { t } = useLanguage();

  const assignments = useQuery({
    queryKey: ['assignments'],
    queryFn: fetchAssignments,
    staleTime: 5 * 60 * 1000,
  });

  const positions = useQuery({
    queryKey: ['positions'],
    queryFn: fetchPositions,
    // The poller refreshes the table continuously; re-read while the tab is open.
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const isLoading = assignments.isLoading || positions.isLoading;
  const isError = assignments.isError || positions.isError;

  const services = assignments.data ? buildServices(assignments.data) : [];
  const byVehicle = new Map(
    (positions.data ?? [])
      .filter(p => p.vehicle_number)
      .map(p => [p.vehicle_number!.toUpperCase().replace(/\s/g, ''), p]),
  );

  const tracked = services
    .map(service => ({
      service,
      position: service.vehicleNumber
        ? byVehicle.get(service.vehicleNumber.toUpperCase().replace(/\s/g, ''))
        : undefined,
    }))
    .filter(entry => entry.position);

  return (
    <section id="live" className="py-24 relative bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t('Live Tracking', 'ನೇರ ಟ್ರ್ಯಾಕಿಂಗ್')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t(
              'Last reported position of KIA-5D buses currently on the road',
              'ರಸ್ತೆಯಲ್ಲಿರುವ ಕೆಐಎ-೫ಡಿ ಬಸ್‌ಗಳ ಕೊನೆಯ ಸ್ಥಾನ',
            )}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <SectionState
            isLoading={isLoading}
            isError={isError}
            isEmpty={!isLoading && !isError && tracked.length === 0}
            loadingLabel={t('Loading live positions…', 'ನೇರ ಸ್ಥಾನ ಲೋಡ್ ಆಗುತ್ತಿದೆ…')}
            errorLabel={t('Unable to load live tracking.', 'ನೇರ ಟ್ರ್ಯಾಕಿಂಗ್ ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.')}
            emptyLabel={t(
              'Live tracking currently unavailable.',
              'ನೇರ ಟ್ರ್ಯಾಕಿಂಗ್ ಪ್ರಸ್ತುತ ಲಭ್ಯವಿಲ್ಲ.',
            )}
          >
            <div className="grid sm:grid-cols-2 gap-5">
              {tracked.map(({ service, position }) => (
                <article
                  key={service.routeNo}
                  className="glass-strong rounded-2xl p-5 shadow-card"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-green-500 animate-pulse" aria-hidden="true" />
                      <h3 className="font-bold text-foreground">
                        KIA-5D / {service.serviceNo}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground break-all text-right">
                      {service.vehicleNumber}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                    <p className="text-sm text-foreground break-words">
                      {position?.location_label ??
                        t('Location name unavailable', 'ಸ್ಥಳದ ಹೆಸರು ಲಭ್ಯವಿಲ್ಲ')}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    {position?.last_refresh_on && (
                      <p className="text-xs text-muted-foreground">
                        {t('Updated', 'ನವೀಕರಿಸಲಾಗಿದೆ')} {position.last_refresh_on}
                      </p>
                    )}
                    {position?.latitude != null && position?.longitude != null && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${position.latitude},${position.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
                      >
                        {t('Open in Maps', 'ನಕ್ಷೆಯಲ್ಲಿ ತೆರೆಯಿರಿ')}
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              {t(
                '* Positions come from the BMTC vehicle feed and may lag by a few minutes.',
                '* ಸ್ಥಾನಗಳು ಬಿಎಂಟಿಸಿ ಫೀಡ್‌ನಿಂದ ಬರುತ್ತವೆ, ಕೆಲವು ನಿಮಿಷ ವಿಳಂಬವಾಗಬಹುದು.',
              )}
            </p>
          </SectionState>
        </div>
      </div>
    </section>
  );
};

export default LiveTracking;
