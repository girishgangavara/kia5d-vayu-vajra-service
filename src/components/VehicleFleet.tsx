import { Bus, CircleCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { buildServices, fetchAssignments, to12Hour } from '@/lib/kia5d';
import { SectionState } from './SectionState';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * One card per KIA-5D service showing the vehicle currently assigned to it.
 * Vehicle numbers are read from kia_5d_routes (the assignment the depot
 * published), never from a static list, so a vehicle swap shows up here.
 */
const VehicleFleet = () => {
  const { t } = useLanguage();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assignments'],
    queryFn: fetchAssignments,
    staleTime: 5 * 60 * 1000,
  });

  const services = data ? buildServices(data) : [];

  return (
    <section id="vehicles" className="py-24 relative bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t('Vehicles', 'ವಾಹನಗಳು')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t(
              'Volvo AC buses currently assigned to each KIA-5D service',
              'ಪ್ರತಿ ಕೆಐಎ-೫ಡಿ ಸೇವೆಗೆ ನಿಯೋಜಿಸಲಾದ ವೋಲ್ವೋ ಎಸಿ ಬಸ್‌ಗಳು',
            )}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <SectionState
            isLoading={isLoading}
            isError={isError}
            isEmpty={!isLoading && !isError && services.length === 0}
            loadingLabel={t('Loading vehicles…', 'ವಾಹನಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ…')}
            errorLabel={t('Unable to load vehicle information.', 'ವಾಹನ ಮಾಹಿತಿ ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.')}
            emptyLabel={t('No vehicle information available.', 'ವಾಹನ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.')}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map(service => (
                <article
                  key={service.routeNo}
                  className="glass-strong rounded-2xl p-5 shadow-card hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow shrink-0">
                      <Bus className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-foreground">KIA-5D / {service.serviceNo}</h3>
                      {service.depotNo && (
                        <p className="text-xs text-muted-foreground">
                          {t('Depot', 'ಡಿಪೋ')}-{service.depotNo}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="font-mono text-lg font-semibold text-foreground tracking-wide break-all">
                    {service.vehicleNumber ?? t('Not assigned', 'ನಿಯೋಜಿಸಿಲ್ಲ')}
                  </p>

                  {service.trips.length > 0 && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      {service.trips.length} {t('trips today', 'ಪ್ರಯಾಣಗಳು')} ·{' '}
                      {to12Hour(service.trips[0].time)}
                      {service.trips.length > 1 &&
                        ` – ${to12Hour(service.trips[service.trips.length - 1].time)}`}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-1.5">
                    <CircleCheck
                      className={`w-3.5 h-3.5 ${
                        service.isToday ? 'text-green-500' : 'text-muted-foreground'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-xs text-muted-foreground">
                      {service.isToday
                        ? t('Published for today', 'ಇಂದಿಗೆ ಪ್ರಕಟಿಸಲಾಗಿದೆ')
                        : t('Last published assignment', 'ಕೊನೆಯ ನಿಯೋಜನೆ')}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </SectionState>
        </div>
      </div>
    </section>
  );
};

export default VehicleFleet;
