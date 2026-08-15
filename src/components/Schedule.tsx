import { Clock, Sun, Sunset } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchAfternoon,
  fetchMorning,
  formatTime,
  serviceNumber,
  type ScheduleRow,
} from '@/lib/kia5d';
import { SectionState } from './SectionState';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * KIA-5D timetable, laid out like the KIA-15 schedule: one card per direction,
 * grouped into morning and afternoon bands. Times come from the
 * KIA_5D_MORNING / KIA_5D_AFTERNOON tables.
 */

const TimeSlot = ({ time, service }: { time: string; service: string }) => (
  <div className="glass px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-primary/20 transition-colors cursor-default flex items-center gap-2">
    {time}
    <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
      5D/{service}
    </span>
  </div>
);

/** Sorted departures for one direction within one time band. */
const band = (rows: ScheduleRow[], key: 'toAirport' | 'toCity') =>
  rows
    .map(row => ({ time: formatTime(row[key]), service: serviceNumber(row.route) }))
    .filter((slot): slot is { time: string; service: string } => Boolean(slot.time))
    .sort((a, b) => a.time.localeCompare(b.time));

const DirectionCard = ({
  title,
  subtitle,
  accent,
  morning,
  afternoon,
}: {
  title: string;
  subtitle: string;
  accent: 'primary' | 'accent';
  morning: { time: string; service: string }[];
  afternoon: { time: string; service: string }[];
}) => {
  const { t } = useLanguage();
  return (
    <div className="glass-strong rounded-2xl p-6 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center ${
            accent === 'primary'
              ? 'from-primary to-primary/60 shadow-glow'
              : 'from-accent to-accent/60 shadow-gold'
          }`}
        >
          <Clock
            className={`w-6 h-6 ${
              accent === 'primary' ? 'text-primary-foreground' : 'text-accent-foreground'
            }`}
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="text-sm font-medium text-accent">{t('Morning', 'ಬೆಳಿಗ್ಗೆ')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {morning.length ? (
              morning.map(slot => (
                <TimeSlot key={`${slot.service}-${slot.time}`} {...slot} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('No morning trips listed.', 'ಬೆಳಿಗ್ಗೆ ಪ್ರಯಾಣಗಳಿಲ್ಲ.')}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sunset className="w-4 h-4 text-orange-400" aria-hidden="true" />
            <span className="text-sm font-medium text-orange-400">
              {t('Afternoon / Evening', 'ಮಧ್ಯಾಹ್ನ / ಸಂಜೆ')}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {afternoon.length ? (
              afternoon.map(slot => (
                <TimeSlot key={`${slot.service}-${slot.time}`} {...slot} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('No afternoon trips listed.', 'ಮಧ್ಯಾಹ್ನ ಪ್ರಯಾಣಗಳಿಲ್ಲ.')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Schedule = () => {
  const { t } = useLanguage();

  const morning = useQuery({
    queryKey: ['schedule', 'morning'],
    queryFn: fetchMorning,
    staleTime: 60 * 60 * 1000,
  });
  const afternoon = useQuery({
    queryKey: ['schedule', 'afternoon'],
    queryFn: fetchAfternoon,
    staleTime: 60 * 60 * 1000,
  });

  const isLoading = morning.isLoading || afternoon.isLoading;
  const isError = morning.isError || afternoon.isError;
  const morningRows = morning.data ?? [];
  const afternoonRows = afternoon.data ?? [];
  const isEmpty = !isLoading && !isError && !morningRows.length && !afternoonRows.length;

  return (
    <section id="schedule" className="py-24 relative bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t('Schedule', 'ವೇಳಾಪಟ್ಟಿ')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t(
              'Departure times for each KIA-5D service, in both directions',
              'ಪ್ರತಿ ಕೆಐಎ-೫ಡಿ ಸೇವೆಯ ನಿರ್ಗಮನ ಸಮಯ, ಎರಡೂ ದಿಕ್ಕುಗಳಲ್ಲಿ',
            )}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <SectionState
            isLoading={isLoading}
            isError={isError}
            isEmpty={isEmpty}
            loadingLabel={t('Loading schedule…', 'ವೇಳಾಪಟ್ಟಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ…')}
            errorLabel={t('Unable to load schedule.', 'ವೇಳಾಪಟ್ಟಿ ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.')}
            emptyLabel={t('No schedule available.', 'ವೇಳಾಪಟ್ಟಿ ಲಭ್ಯವಿಲ್ಲ.')}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <DirectionCard
                title={t('From Art of Living', 'ಆರ್ಟ್ ಆಫ್ ಲಿವಿಂಗ್‌ನಿಂದ')}
                subtitle={t('To Airport', 'ವಿಮಾನ ನಿಲ್ದಾಣಕ್ಕೆ')}
                accent="primary"
                morning={band(morningRows, 'toAirport')}
                afternoon={band(afternoonRows, 'toAirport')}
              />
              <DirectionCard
                title={t('From Airport', 'ವಿಮಾನ ನಿಲ್ದಾಣದಿಂದ')}
                subtitle={t('To Art of Living', 'ಆರ್ಟ್ ಆಫ್ ಲಿವಿಂಗ್‌ಗೆ')}
                accent="accent"
                morning={band(morningRows, 'toCity')}
                afternoon={band(afternoonRows, 'toCity')}
              />
            </div>
          </SectionState>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {t(
              '* Schedules may vary on holidays and during traffic disruptions.',
              '* ರಜಾದಿನಗಳಲ್ಲಿ ವೇಳಾಪಟ್ಟಿ ಬದಲಾಗಬಹುದು.',
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
