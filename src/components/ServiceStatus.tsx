import { useQuery } from '@tanstack/react-query';
import { buildServices, fetchAssignments, istToday } from '@/lib/kia5d';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Service status, derived strictly from what the backend published.
 *
 *   green  - crew + vehicle published for today's date (IST) on every service
 *   amber  - published for today, but only on some services
 *   grey   - nothing published for today, or the request failed
 *
 * It never claims "Live"/"Operating" on its own; the label only reflects
 * whether today's assignment data exists.
 */
const ServiceStatus = () => {
  const { t } = useLanguage();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assignments'],
    queryFn: fetchAssignments,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full" role="status">
        <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground animate-pulse" aria-hidden="true" />
        <span className="text-sm text-muted-foreground">
          {t('Checking service status…', 'ಸೇವಾ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ…')}
        </span>
      </div>
    );
  }

  const services = !isError && data ? buildServices(data) : [];
  const publishedToday = services.filter(s => s.isToday).length;

  let dotClass = 'bg-muted-foreground';
  let label = t('Service information unavailable', 'ಸೇವಾ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ');

  if (publishedToday > 0 && publishedToday === services.length) {
    dotClass = 'bg-green-500';
    label = t('Service Active', 'ಸೇವೆ ಸಕ್ರಿಯವಾಗಿದೆ');
  } else if (publishedToday > 0) {
    dotClass = 'bg-accent';
    label = t(
      `Limited Service - ${publishedToday} of ${services.length} services published`,
      `ಸೀಮಿತ ಸೇವೆ - ${services.length} ರಲ್ಲಿ ${publishedToday} ಪ್ರಕಟಿಸಲಾಗಿದೆ`,
    );
  }

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 glass px-4 py-2 rounded-full">
      <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} aria-hidden="true" />
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">
        · {t('Updated for', 'ದಿನಾಂಕ')} {istToday()} IST
      </span>
    </div>
  );
};

export default ServiceStatus;
